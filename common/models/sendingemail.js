'use strict';

let sendE = require('../../server/controller/mpiresults/sendingEmail');
module.exports = (SendingEmail) => {
  SendingEmail.disableRemoteMethodByName('find');
  SendingEmail.disableRemoteMethod('findById', true);
  SendingEmail.disableRemoteMethod('findOne', true);

  // disable count & exists
  SendingEmail.disableRemoteMethod('confirm', true);
  SendingEmail.disableRemoteMethod('count', true);
  SendingEmail.disableRemoteMethod('exists', true);

  SendingEmail.disableRemoteMethod('create', true);
  SendingEmail.disableRemoteMethod('upsert', true);
  SendingEmail.disableRemoteMethod('deleteById', true);
  SendingEmail.disableRemoteMethod('updateAll', true);
  SendingEmail.disableRemoteMethod('updateAttributes', false);
  SendingEmail.disableRemoteMethod('createChangeStream', true);

  SendingEmail.disableRemoteMethod('replaceById', true);
  SendingEmail.disableRemoteMethod('replaceOrCreate', true);
  SendingEmail.disableRemoteMethod('upsertWithWhere', true);

  // ptfs methods
  SendingEmail.disableRemoteMethod('__get__ptfs', false);
  SendingEmail.disableRemoteMethod('__count__ptfs', false);
  SendingEmail.disableRemoteMethod('__create__ptfs', false);
  SendingEmail.disableRemoteMethod('__delete__ptfs', false);
  SendingEmail.disableRemoteMethod('__destroyById__ptfs', false);
  SendingEmail.disableRemoteMethod('__findById__ptfs', false);
  SendingEmail.disableRemoteMethod('__updateById__ptfs', false);

  SendingEmail.disableRemoteMethod('__exists__ptfs', false);
  SendingEmail.disableRemoteMethod('__link__ptfs', false);
  SendingEmail.disableRemoteMethod('__unlink__ptfs', false);

  // pes methods
  SendingEmail.disableRemoteMethod('__get__pes', false);
  SendingEmail.disableRemoteMethod('__count__pes', false);
  SendingEmail.disableRemoteMethod('__create__pes', false);
  SendingEmail.disableRemoteMethod('__delete__pes', false);
  SendingEmail.disableRemoteMethod('__destroyById__pes', false);
  SendingEmail.disableRemoteMethod('__findById__pes', false);
  SendingEmail.disableRemoteMethod('__updateById__pes', false);

  SendingEmail.disableRemoteMethod('__exists__pes', false);
  SendingEmail.disableRemoteMethod('__link__pes', false);
  SendingEmail.disableRemoteMethod('__unlink__pes', false);

  // wishes methods
  SendingEmail.disableRemoteMethod('__get__wishes', false);
  SendingEmail.disableRemoteMethod('__count__wishes', false);
  SendingEmail.disableRemoteMethod('__create__wishes', false);
  SendingEmail.disableRemoteMethod('__delete__wishes', false);
  SendingEmail.disableRemoteMethod('__destroyById__wishes', false);
  SendingEmail.disableRemoteMethod('__findById__wishes', false);
  SendingEmail.disableRemoteMethod('__updateById__wishes', false);

  SendingEmail.disableRemoteMethod('__exists__wishes', false);
  SendingEmail.disableRemoteMethod('__link__wishes', false);
  SendingEmail.disableRemoteMethod('__unlink__wishes', false);

  // disable tags
  SendingEmail.disableRemoteMethod('__get__tags', false);
  SendingEmail.disableRemoteMethod('__count__tags', false);
  SendingEmail.disableRemoteMethod('__create__tags', false);
  SendingEmail.disableRemoteMethod('__delete__tags', false);
  SendingEmail.disableRemoteMethod('__destroyById__tags', false);
  SendingEmail.disableRemoteMethod('__findById__tags', false);
  SendingEmail.disableRemoteMethod('__updateById__tags', false);

  SendingEmail.disableRemoteMethod('__exists__tags', false);
  SendingEmail.disableRemoteMethod('__link__tags', false);
  SendingEmail.disableRemoteMethod('__unlink__tags', false);

  SendingEmail.resultV2 = function(meplId, sendto, cb) {
    let reg = /^\d+$/;
    if (reg.test(meplId)) {
      sendE.sendingEmail(meplId, sendto, function(err, result) {
        let obj = {};
        obj.errorMessage = err;
        obj.result = result;
        cb(null, obj);
      });
    } else {
      let obj = {};
      obj.errorMessage = null;
      obj.result = false;
      cb(null, obj);
    }
  };
  SendingEmail.remoteMethod(
    'resultV2', {
      accepts: [{
        arg: 'meplId',
        type: 'string',
      },
      {
        arg: 'sendto',
        type: 'string'}],
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '/v2/sendingemail',
        verb: 'post',
      },
    }
  );
};
