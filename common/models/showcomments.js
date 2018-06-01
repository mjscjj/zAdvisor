'use strict';

let showc = require('../../server/controller/reportsComments/showComments');
let insertc = require('../../server/controller/reportsComments/insertComment');
module.exports = (ShowComments) => {
  ShowComments.disableRemoteMethodByName('find');
  ShowComments.disableRemoteMethod('findById', true);
  ShowComments.disableRemoteMethod('findOne', true);

  // disable count & exists
  ShowComments.disableRemoteMethod('confirm', true);
  ShowComments.disableRemoteMethod('count', true);
  ShowComments.disableRemoteMethod('exists', true);

  ShowComments.disableRemoteMethod('create', true);
  ShowComments.disableRemoteMethod('upsert', true);
  ShowComments.disableRemoteMethod('deleteById', true);
  ShowComments.disableRemoteMethod('updateAll', true);
  ShowComments.disableRemoteMethod('updateAttributes', false);
  ShowComments.disableRemoteMethod('createChangeStream', true);

  ShowComments.disableRemoteMethod('replaceById', true);
  ShowComments.disableRemoteMethod('replaceOrCreate', true);
  ShowComments.disableRemoteMethod('upsertWithWhere', true);

  // ptfs methods
  ShowComments.disableRemoteMethod('__get__ptfs', false);
  ShowComments.disableRemoteMethod('__count__ptfs', false);
  ShowComments.disableRemoteMethod('__create__ptfs', false);
  ShowComments.disableRemoteMethod('__delete__ptfs', false);
  ShowComments.disableRemoteMethod('__destroyById__ptfs', false);
  ShowComments.disableRemoteMethod('__findById__ptfs', false);
  ShowComments.disableRemoteMethod('__updateById__ptfs', false);

  ShowComments.disableRemoteMethod('__exists__ptfs', false);
  ShowComments.disableRemoteMethod('__link__ptfs', false);
  ShowComments.disableRemoteMethod('__unlink__ptfs', false);

  // pes methods
  ShowComments.disableRemoteMethod('__get__pes', false);
  ShowComments.disableRemoteMethod('__count__pes', false);
  ShowComments.disableRemoteMethod('__create__pes', false);
  ShowComments.disableRemoteMethod('__delete__pes', false);
  ShowComments.disableRemoteMethod('__destroyById__pes', false);
  ShowComments.disableRemoteMethod('__findById__pes', false);
  ShowComments.disableRemoteMethod('__updateById__pes', false);

  ShowComments.disableRemoteMethod('__exists__pes', false);
  ShowComments.disableRemoteMethod('__link__pes', false);
  ShowComments.disableRemoteMethod('__unlink__pes', false);

  // wishes methods
  ShowComments.disableRemoteMethod('__get__wishes', false);
  ShowComments.disableRemoteMethod('__count__wishes', false);
  ShowComments.disableRemoteMethod('__create__wishes', false);
  ShowComments.disableRemoteMethod('__delete__wishes', false);
  ShowComments.disableRemoteMethod('__destroyById__wishes', false);
  ShowComments.disableRemoteMethod('__findById__wishes', false);
  ShowComments.disableRemoteMethod('__updateById__wishes', false);

  ShowComments.disableRemoteMethod('__exists__wishes', false);
  ShowComments.disableRemoteMethod('__link__wishes', false);
  ShowComments.disableRemoteMethod('__unlink__wishes', false);

  // disable tags
  ShowComments.disableRemoteMethod('__get__tags', false);
  ShowComments.disableRemoteMethod('__count__tags', false);
  ShowComments.disableRemoteMethod('__create__tags', false);
  ShowComments.disableRemoteMethod('__delete__tags', false);
  ShowComments.disableRemoteMethod('__destroyById__tags', false);
  ShowComments.disableRemoteMethod('__findById__tags', false);
  ShowComments.disableRemoteMethod('__updateById__tags', false);

  ShowComments.disableRemoteMethod('__exists__tags', false);
  ShowComments.disableRemoteMethod('__link__tags', false);
  ShowComments.disableRemoteMethod('__unlink__tags', false);

  ShowComments.resultV2 = function(meplId, cb) {
    let reg = /^\d+$/;
    if (reg.test(meplId)) {
      showc.showComments(meplId, function(err, result) {
        let obj = {};
        obj.errorMessage = err;
        obj.result = result;
        if (result.length === 0) {
          insertc.insertComment(meplId, '', function(err, result) {
            let obj = {};
            obj.errorMessage = err;
            obj.result = result;
            showc.showComments(meplId, function(err, result) {
              let obj = {};
              obj.errorMessage = err;
              obj.result = result;
              cb(null, obj);
            });
          });
        } else {
          cb(null, obj);
        }
      });
    } else {
      let obj = {};
      obj.errorMessage = null;
      obj.result = false;
      cb(null, obj);
    }
  };
  ShowComments.remoteMethod(
    'resultV2', {
      accepts: [{
        arg: 'meplId',
        type: 'string',
      }],
      returns: {
        type: 'object',
        root: true,
      },
      http: {
        path: '//',
        verb: 'post',
      },
    }
  );
};
