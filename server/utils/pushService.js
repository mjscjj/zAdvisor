'use strict';
const app = require('../server');
// var Promise = require('bluebird');
const logger = require('../utils/logHelper').helper;
const retry = require('retry');

// Push to specific user
module.exports = (username, badge, alert, expirationInterval, cb) => {
  const PushModel = app.models.push;
  const Notification = app.models.Notify;
  const defaultAppID = 'zAdvisorApplication';

  const note = new Notification({
    expirationInterval,
    // contentAvailable: true,
    message: alert,
    alert,
    badge,
  });

  const query = {};
  query.appId = defaultAppID;
  query.userId = username;

  const operation = retry.operation({
    retries: 3,
    factor: 5,
    minTimeout: 1 * 1000,
    maxTimeout: 5 * 1000,
    randomize: true,
  });

  // used for push Test
  /*
      operation.attempt(function(currentAttempt){
        let err = new Error('Test Error');

        if (operation.retry(err)) {
          console.log(err);
          return;
        }
        cb(err? operation.mainError(): null);
      });
  */
  operation.attempt(() => {
    PushModel.notifyByQuery(query, note, (err) => {
      if (operation.retry(err)) {
        logger.writeErr('Push Model Notify By Query Error', err.stack);
        return;
      }

      cb(err ? operation.mainError() : null, username, badge);
    });
  });
};
