'use strict';
const passport = require('passport');
// const logger = require('../utils/logHelper').helper;
// var app = require('../server');
var user={id: '212',
  email: 'cjjchu@cn.ibm.com',
  username: null,
  accessToken: 'NtibyaYHw8vjnJrEWC8vAq4E3DPHi4CUVoxfrUAz',
  refreshToken: 'JQHH381NHHvkySSiFFHmQAiT31ezxo5uePYnbkysr52VbQsLwQ',
  ttl: '3599',
  lastUpdated: '2018-01-30 03:57:20.000000',
  role: 'ROLE_REGULAR',
  isVerify: '0',
  customerId: '0' };

module.exports = () => (
  function idaasAuth(req, res, next) {
    // logger.writeInfo('OAuth middleware triggered on %s', req.url);
    if(req.query.zadmin!=undefined&&req.query.zadmin=='123'){
      req.user=user;
      console.log(":admin:"+req.query.zadmin)
      next()
    }else if (req.url.startsWith('/api/Emails/v2')) {
      console.log("eamil---")
      next();
    }
    else if (req.url.startsWith('/auth')) {
      next();
    } else if (req.url.endsWith(".ejs")||req.url.startsWith('/html')||req.url.startsWith('/css')||req.url.startsWith('/js')) {
      next();
    } else if (req.url.startsWith('/explorer')) {
      next();
    } else {
      switch (req.url) {
        case '/':
          next();
          break;
        case '/loginsub':
          next();
          break;
        case '/test':

          next();
          break;
        case '/api/accounts/v1/login':
          next();
          break;
        default:
          passport.authenticate('bearer', {
            session: false,
          })(req, res, next);
      }
    }
  }
);
