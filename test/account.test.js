/* global define, it, describe, before, after */

'use strict';
const app = require('../server/server');
const json = require('./api-request');
const assert = require('assert');
const co = require('co');
const OAuth2 = require('oauth').OAuth2;

const clientID = 'ZTkzMTNlZjItMjc4ZC00';
const clientSecret = 'ZmM0NTJiOGQtZDk1ZS00';
const authorizationURL = 'https://prepiam.toronto.ca.ibm.com/idaas/oidc/endpoint/default/authorize';
const tokenURL = 'https://prepiam.toronto.ca.ibm.com/idaas/oidc/endpoint/default/token';

let testAccount;
let testTag;

describe('Account Rest API request', () => {
  const Account = app.models.Account;
  const Tag = app.models.Tag;
  const UserTag = app.models.UserTag;

  before((done) => {
    co(function* doBefore() {
      // create account for test
      testAccount = yield Account.create({
        email: 'test@cn.ibm.com',
        accessToken: 'test_access',
        refreshToken: 'test_refresh',
        ttl: 3600,
        lastUpdated: Date.now(),
        role: 'ROLE_USER',
      });

      // create tags for test
      testTag = yield Tag.create({
        production: 'DB2',
        tagName: 'DB2_TEST_TAG',
      });

      return true;
    }).then(() => (
      done()
    ), (err) => {
      if (err) throw err;
    });
  });

  after((done) => {
    co(function* doBefore() {
      yield UserTag.destroyAll({
        ownerId: testAccount.id,
      });

      yield Tag.destroyAll({
        production: 'DB2',
        tagName: 'DB2_TEST_TAG',
      });

      yield Account.destroyAll({
        email: 'test@cn.ibm.com',
      });

      return true;
    }).then(() => (
      done()
    ), (err) => {
      if (err) throw err;
    });
  });

  it('should login with valid id / password and return accessToken / refreshToken', (done) => {
    const oauth2 = new OAuth2(clientID, clientSecret, '', authorizationURL, tokenURL);

    const params = {};
    params.grant_type = 'password';
    // NOTICE: Do NOT upload your username and password to public git server
    params.username = 'PUT YOUR USERNAME HERE';
    params.password = 'PUT YOUR PASSWORD HERE';
    params.scope = 'openid';

    oauth2.getOAuthAccessToken('', params,
      (err, accessToken, refreshToken) => {
        if (err) return done(err);

        assert.notEqual(accessToken, undefined);
        assert.notEqual(refreshToken, undefined);
        return done();
      });
  });

  it('should not allow access without access token (fetch tags)', (done) => {
    json('get', '/api/accounts/v1/me/tags')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should get correct tags', (done) => {
    json('get', '/api/accounts/v1/me/tags?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        let foundTag = false;
        for (const tag of res.body) {
          if (tag.tagName === 'DB2_TEST_TAG' && tag.production === 'DB2' && tag.status === true) {
            foundTag = true;
          }
        }
        assert(foundTag === true);
        return done();
      });
  });

  it('should not allow access without access token (update tags)', (done) => {
    json('post', '/api/accounts/v1/me/tags')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should update userTags correctly', (done) => {
    json('post', '/api/accounts/v1/me/tags?access_token=test_access')
      .send({
        tags: [{
          id: testTag.id,
          production: testTag.production,
          tagName: testTag.tagName,
          status: false,
        }],
      })
      .expect(204, (err) => {
        if (err) return done(err);
        console.log(testTag.id);
        UserTag.findOne({
          where: {
            tagId: testTag.id,
            ownerId: testAccount.id,
          },
        }, (err1, userTag) => {
          if (err1) return done(err1);
          assert.notEqual(userTag, null);
          return done();
        });

        return true;
      });
  });

  it('should get correct tags after updating', (done) => {
    json('get', '/api/accounts/v1/me/tags?access_token=test_access')
      .expect(200, (err, res) => {
        if (err) return done(err);
        assert(typeof res.body === 'object');
        let foundTag = false;
        for (const tag of res.body) {
          if (tag.tagName === 'DB2_TEST_TAG' && tag.production === 'DB2' && tag.status === false) {
            foundTag = true;
          }
        }
        assert(foundTag === true);
        return done();
      });
  });

// don't input id anymore
/*
  it('should return 400 if tag is invalid (wrong id)', (done) => {
    json('post', '/api/v1/accounts/me/tags?access_token=test_access')
      .send({
        tags: [{
          id: -1,
          production: testTag.production,
          tagName: testTag.tagName,
          status: true,
        }],
      })
      .expect(400, (err) => {
        if (err) return done(err);
        return done();
      });
  }); */

  it('should return 400 if tag is invalid (wrong production)', (done) => {
    json('post', '/api/accounts/v1/me/tags?access_token=test_access')
      .send({
        tags: [{
          id: testTag.id,
          production: 'WRONG_PRODUCTION',
          tagName: testTag.tagName,
          status: true,
        }],
      })
      .expect(400, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return 400 if tag is invalid (wrong tagName)', (done) => {
    json('post', '/api/accounts/v1/me/tags?access_token=test_access')
      .send({
        tags: [{
          id: testTag.id,
          production: testTag.production,
          tagName: 'WRONG_TAG_NAME',
          status: true,
        }],
      })
      .expect(400, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should not allow access without access token (logout)', (done) => {
    json('post', '/api/accounts/v1/logout/')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should logout', (done) => {
    json('post', '/api/accounts/v1/logout/1?access_token=test_access')
      .expect(204, (err) => {
        if (err) return done(err);
        Account.findOne({
          where: {
            email: 'test@cn.ibm.com',
          },
        }, (err1, user) => {
          if (err1) return done(err1);
          assert.notEqual(user, null);
          assert.notEqual(user, undefined);
          assert.equal(user.accessToken, null);
          assert.equal(user.refreshToken, null);

          return done();
        });

        return true;
      });
  });

  it('should not allow access after logout (fetch tags)', (done) => {
    json('get', '/api/accounts/v1/me/tags?access_token=test_access')
      .expect(401, (err) => {
        if (err) return done(err);
        return done();
      });
  });
});
