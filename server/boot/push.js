'use strict';

/**
 * @ignore  =====================================================================================
 * @file initialize default application and provide push interface used for test
 * @author  fjbj@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2016. All Rights Reserved.
 * @ignore  created in 2016-07-21
 * @ignore  =====================================================================================
 */
// let pushService = require('../utils/pushService');
const logger = require('../utils/logHelper').helper;
const config = require('../config/push-config');

module.exports = (app) => {
  // Run only once
  /*
  app.datasources['mydashdb'].autoupdate([
      'App',
      'Install',
      'Notify'
      ], function(err) {
        if(err) console.log(err);
        else console.log("Migration Done");
        // cb(); // or cb(err) if you want to abort boot on error
  });
  return;
  */

  // let Notification = app.models.Notify;
  const Application = app.models.App;
  const PushModel = app.models.push;
  const defaultAppID = 'zAdvisorApplication';
  PushModel.on('error', (err) => {
    logger.writeErr('Push Notification error: ', err.stack);
  });
  logger.writeInfo('Initializing Applications...');

  function initApplications() {
    const defaultApp = {
      id: defaultAppID,
      userId: 'zAdvisor',
      name: config.appName,

      description: 'zAdvisorApplication',
      pushSettings: {
        apns: {
          certData: config.apnsCertData,
          keyData: config.apnsKeyData,
          production: true,
          pushOptions: {
            // Extra options can go here for APN
            passphrase: 'abcabc',
            port: 2195,
          },
          feedbackOptions: {
            passphrase: 'abcabc',
            batchFeedback: true,
            interval: 300,
          },
        },
        gcm: {
          serverApiKey: config.gcmServerApiKey,
        },
      },
    };

    // Register an Application to database
    function registerApp(cb) {
      logger.writeInfo('Registering a new Application...');
      // Hack to set the app id to a fixed value so that we don't have to change
      // the client settings
      Application.beforeSave = function setDefaultID(next) {
        if (this.name === defaultApp.name) {
          this.id = defaultAppID;
        }
        next();
      };
      Application.register(
        defaultApp.userId,
        defaultApp.name, {
          description: defaultApp.description,
          pushSettings: defaultApp.pushSettings,
        },
        (err, application) => {
          if (err) {
            return cb(err);
          }
          return cb(null, application);
        }
      );
    }

    // function updateOrCreateApp(cb) {
    //   Application.findOne({
    //     where: {
    //       id: defaultApp.id,
    //     },
    //   }, (err, result) => {
    //     if (err) cb(err);
    //     if (result) {
    //       logger.writeInfo(`Updating application: ${result.id}`);
    //       delete defaultApp.id;
    //       result.updateAttributes(defaultApp, cb);
    //       return null;
    //     }
    //     return registerApp(cb);
    //   });
    // }
    //
    // updateOrCreateApp((err, appModel) => {
    //   if (err) {
    //     logger.writeErr('Update Or Create App Failed: ', err.stack);
    //     // throw err;
    //   }
    //   logger.writeInfo(`Application id: ${appModel.id}`);
    // });
  }

  // Init work
  initApplications();
};
