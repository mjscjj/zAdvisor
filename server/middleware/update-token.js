'use strict';

const logger = require('../utils/logHelper').helper;

module.exports = () => {
  return function updateToken(req, res, next) {
    // console.log('AccessToken update middleware triggered on %s', req.url);
    if (req.user && req.user.accessToken) {
      res.append('Access-Token', req.user.accessToken);
      if (req.user.isUpdated) {
        logger.writeInfo(`middleware update token -> ${req.user.accessToken}`);
        req.headers['if-none-match'] = 'no-match-for-this';
      }
    }

    next();
  };
};
