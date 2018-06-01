'use strict';

// var nodemailer = require('nodemailer');
const VError = require('verror');
const logger = require('../../server/utils/logHelper').helper;
const errorHelper = require('../../server/utils/logHelper').helper;
const co = require('co');

module.exports = (Comment) => {
  Comment.disableRemoteMethodByName('find');
  Comment.disableRemoteMethodByName('findById');
  Comment.disableRemoteMethodByName('findOne');

  // disable count & exists
  Comment.disableRemoteMethodByName('confirm');
  Comment.disableRemoteMethodByName('count');
  Comment.disableRemoteMethodByName('exists');

  Comment.disableRemoteMethodByName('create');
  Comment.disableRemoteMethodByName('upsert');
  Comment.disableRemoteMethodByName('deleteById');
  Comment.disableRemoteMethodByName('updateAll');
  Comment.disableRemoteMethodByName('updateAttributes');
  Comment.disableRemoteMethodByName('createChangeStream');

  Comment.disableRemoteMethodByName('replaceById');
  Comment.disableRemoteMethodByName('replaceOrCreate');
  Comment.disableRemoteMethodByName('upsertWithWhere');

  /*
  var smtpConfig = {
      host: 'd23ml028.cn.ibm.com',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: 'db2zOSduty@cn.ibm.com',
          pass: 'UsDuty0706'
      }
  };

  Comment.sendEmail = function(email, cb) {
      let smtpTransport = nodemailer.createTransport(smtpConfig);
      //console.log('create smtpTransport');

      smtpTransport.sendMail({
        from : '"shizy"<' + email.from + '>',
        to: 'shizy@cn.ibm.com',
        subject: 'Feedback from customer',
        text: email.text,
        html: '<b>' + email.text + '</b>'
      }, function(err, info){
        if (err) {
           cb(err);
        } else {
          console.log('Message sent: ' + info.response);
          cb(info);
        }
      });
  };
  */

  Comment.save_v1 = (feedback, req, cb) => {
    co(function* doSave() {
      const comment = yield Comment.create({
        from: feedback.from,
        text: feedback.text,
        created: Date.now(),
      });

      return comment;
    }).then((comment) => {
      cb(null, comment);
    }, (err) => {
      const error = new VError(err, 'Send feedback error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err));
    });
  };

  Comment.remoteMethod(
    'save_v1', {
      accepts: [{
        arg: 'feedback',
        type: 'object',
        http: {
          source: 'body',
        },
      }, {
        arg: 'req',
        type: 'object',
        http: {
          source: 'req',
        },
      }],
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v1/send',
        verb: 'post',
        status: 201,
      },
    }
  );
};
