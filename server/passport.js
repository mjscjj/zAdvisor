'use strict';

const BearerStrategy = require('passport-http-bearer').Strategy;
const OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;

const clientID = 'YzAyMmVhOTMtMTVhNS00';
const clientSecret = 'MTBhZGQwNmYtMTBjMi00';
const authorizationURL = 'https://idaas.iam.ibm.com/idaas/oidc/endpoint/default/authorize';
const tokenURL = 'https://idaas.iam.ibm.com/idaas/oidc/endpoint/default/token';
const issuer = 'https://idaas.iam.ibm.com';

// const clientID = 'ZTkzMTNlZjItMjc4ZC00';
// const clientSecret = 'ZmM0NTJiOGQtZDk1ZS00';
// const authorizationURL = 'https://prepiam.toronto.ca.ibm.com/idaas/oidc/endpoint/default/authorize';
// const tokenURL = 'https://prepiam.toronto.ca.ibm.com/idaas/oidc/endpoint/default/token';
// const issuer = 'https://prepiam.toronto.ca.ibm.com';

// const callbackURL = 'https://zadvisor.mybluemix.net/auth/sso/callback';
// const callbackURL = 'https://zAdvisort.mybluemix.net/auth/sso/callback';
// const callbackURL = 'https://localhost:3000/auth/sso/callback ';
const  callbackURL = 'https://zadvisort.mybluemix.net/auth/sso/callback';
const passport = require('passport');

const OAuth2 = require('oauth').OAuth2;
const app = require('./server');
const co = require('co');
const _ = require('lodash');
const logger = require('./utils/logHelper').helper;
const VError = require('verror');
// const util = require('util');

passport.use(new OpenIDConnectStrategy({
  authorizationURL,
  tokenURL,
  clientID,
  clientSecret,
  callbackURL,
  issuer,
  scope: 'openid',
  response_type: 'code',
  skipUserProfile: true,
}, (iss, sub, profile, accessToken, refreshToken, params, done) => {
  if (profile.id) {
  profile.id = profile.id.toLowerCase();
}
const Account = app.models.Account;
const Notice = app.models.Notice;
const UserNotice = app.models.UserNotice;

logger.writeInfo(`Profile = ${JSON.stringify(profile)}`);

let tx;
co(function* openIDSearchUser() {
  let user = yield Account.findOne({
    where: {
      email: profile.id,
    },
  });

  if (!user) {
    tx = yield Account.beginTransaction({
      isolationLevel: Account.Transaction.READ_COMMITTED,
    });

    // no user found, create new
    user = yield Account.create({
      accessToken,
      refreshToken,
      role: 'ROLE_REGULAR',
      email: profile.id,
      lastUpdated: Date.now(),
      ttl: params.expires_in,
    }, {
      transaction: tx,
    });

    // find recent 2 month notices and notify new user
    const TWO_MONTH = 2 * 30 * 24 * 60 * 60 * 1000; // Month in milliseconds
    const notices = yield Notice.find({
      created: {
        gt: new Date(Date.now() - TWO_MONTH),
      },
    });

    yield UserNotice.create(_.map(notices, (o) => ({
      ownerId: user.id,
      noticeId: `${o.id}`,
    })), {
      transaction: tx,
    });
  } else {
    // update accessToken/refreshToken/ttl/lastUpdated
    // FIXME: why search user again??
    /* let tmpUser = yield Account.findOne({
      'where': {
        email: profile.id,
      }
    }); */

    logger.writeInfo(`OpenId login, accessToken before =  ${user.accessToken}`);
    user = yield user.updateAttributes({
      accessToken,
      refreshToken,
      lastUpdated: Date.now(),
      ttl: params.expires_in,
    });

    logger.writeInfo(`OpenId login, accessToken after =  ${user.accessToken}`);
  }

  return user;
}).then((val) => {
  if (tx) tx.commit();
return done(null, val);
}, (err) => {
  if (tx) tx.rollback();
  const error = new VError(err, 'Idaas Login Error');
  logger.writeErr(JSON.stringify(error), error.stack);

  return done(null, false);
});
}));

passport.use(new BearerStrategy(
  (token, done) => {
  const Account = app.models.Account;
const Install = app.models.Install;

Account.findOne({
  where: {
    accessToken: token,
  },
}, (err, user) => {
  if (err) {
    const error = new VError(err, 'Token Refresh Error');
    logger.writeErr(JSON.stringify(error), error.stack);
    return done(null, false);
  }

  if (!user) {
  return done(null, false);
}

// only for test
// return done(null, user, {
//  scope: 'openid',
//  });

// don't need to save user information into context, because
// passport already return user in req.user

// when user is admin or accessToken not expired
if (user.role === 'ROLE_ADMIN' || ((Date.now() - user.lastUpdated.getTime()) / 1000) < user.ttl) {
  return done(null, user, {
    scope: 'openid',
  });
}

// refresh accessToken using refreshToken
const oauth2 = new OAuth2(clientID, clientSecret, '', authorizationURL, tokenURL);

const params = {};
params.grant_type = 'refresh_token';

logger.writeInfo(`${user.email} try to refresh accessToken using refreshToken`);
oauth2.getOAuthAccessToken(user.refreshToken, params,
  (err1, accessToken, refreshToken) => {
  if (err1) {
    const error = new VError(err1, 'Token Refresh Error');
    logger.writeErr(JSON.stringify(error), error.stack);

    // refresh Token expire, now remove Install record
    Install.destroyAll({
      userId: user.email,
      // deviceId,
    }, (err3) => {
      if (err3) {
        const error = new VError(err3, 'Token Refresh Error');
        logger.writeErr(JSON.stringify(error), error.stack);
      }
      return done(null, false);
  });
  }

  logger.writeInfo(`New token = ${accessToken}`);

// update accessToken/refreshToken/ttl/lastUpdated
user.updateAttributes({
  accessToken,
  refreshToken,
  lastUpdated: Date.now(),
}, (err2, updatedUser) => {
  if (err2) {
    const error = new VError(err2, 'Token Refresh Error');
    logger.writeErr(JSON.stringify(error), error.stack);
    return done(null, false);
  }

  updatedUser.isUpdated = true;
logger.writeInfo(`User attributes update OK, user -> ${JSON.stringify(updatedUser)}`);
return done(null, updatedUser, {
  scope: 'openid',
});
});
return true;
});
return true;
});
}));

passport.serializeUser((user, callback) => {
  callback(null, user);
});
passport.deserializeUser((obj, callback) => {
  callback(null, obj);
});

module.exports = passport;
