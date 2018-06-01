'use strict';
var fs=require('fs')
const logger = require('../../server/utils/logHelper').helper;
module.exports = function(Email) {
  Email.disableRemoteMethodByName('find')
  Email.disableRemoteMethodByName('findById');
  Email.disableRemoteMethodByName('findOne');
  // disable count & exists
  Email.disableRemoteMethodByName('confirm');
  Email.disableRemoteMethodByName('count');
  Email.disableRemoteMethodByName('exists');
  Email.disableRemoteMethodByName('create');
  Email.disableRemoteMethodByName('upsert');
  Email.disableRemoteMethodByName('deleteById');
  Email.disableRemoteMethodByName('updateAll');
  Email.disableRemoteMethodByName('updateAttributes');
  Email.disableRemoteMethodByName('createChangeStream');

  Email.disableRemoteMethodByName('replaceById');
  Email.disableRemoteMethodByName('replaceOrCreate');
  Email.disableRemoteMethodByName('upsertWithWhere');

  Email.verify_eamil_v2 = function(customerId, toEmail, req, cb) {
    var re = {};
    var  codes=1000+Math.ceil(Math.random()*9000)
    re.customerId = customerId;
    re.toEmail = toEmail;
    re.codes=codes;
    Email.app.models.Emailtemp.upsert(re,function(err,resu){
      if(err){
        logger.writeErr(JSON.stringify(err),err.stack)
        cb(err)
        return
      }
      logger.writeInfo(JSON.stringify(resu))
      cb(null,resu);
    })

  };

  Email.remoteMethod(
    'verify_eamil_v2', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true,
      },{
        arg: 'toEmail',
        type: 'string',
        required: true,
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
        path: '/v2/verify_eamil',
        verb: 'post',
      },
    }
  );



  Email.send_result_filecontent_v2 = function(customerId, toEmail,fileName,fileContent,req, cb) {
    var re = {};
    re.customerId = customerId;
    re.toEmail = toEmail;
    re.fileName=fileName;
    re.fileContent=fileContent;
    Email.app.models.Emailtemp.upsert(re,function(err,resu){
      if(err){
        logger.writeErr(JSON.stringify(err),err.stack)
        cb(err)
      }
      cb(null,resu)
    })
  };

  Email.remoteMethod(
    'send_result_filecontent_v2', {
      accepts: [{
        arg: 'customerId',
        type: 'string',
        required: true,
      },{
        arg: 'toEmail',
        type: 'string',
        required: true,
      }, {
        arg: 'fileName',
        type: 'string',
        required: true,
      },{
        arg: 'fileContent',
        type: 'string',
        required: true,
      },{
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
        path: '/v2/send_result_filecontent_v2',
        verb: 'post',
      },
    }
  );

};
