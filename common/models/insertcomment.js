'use strict';

let insertc = require('../../server/controller/reportsComments/insertComment');
module.exports = (InsertComment) => {
  InsertComment.disableRemoteMethodByName('find');
  InsertComment.disableRemoteMethod('findById', true);
  InsertComment.disableRemoteMethod('findOne', true);

  // disable count & exists
  InsertComment.disableRemoteMethod('confirm', true);
  InsertComment.disableRemoteMethod('count', true);
  InsertComment.disableRemoteMethod('exists', true);

  InsertComment.disableRemoteMethod('create', true);
  InsertComment.disableRemoteMethod('upsert', true);
  InsertComment.disableRemoteMethod('deleteById', true);
  InsertComment.disableRemoteMethod('updateAll', true);
  InsertComment.disableRemoteMethod('updateAttributes', false);
  InsertComment.disableRemoteMethod('createChangeStream', true);

  InsertComment.disableRemoteMethod('replaceById', true);
  InsertComment.disableRemoteMethod('replaceOrCreate', true);
  InsertComment.disableRemoteMethod('upsertWithWhere', true);

  // ptfs methods
  InsertComment.disableRemoteMethod('__get__ptfs', false);
  InsertComment.disableRemoteMethod('__count__ptfs', false);
  InsertComment.disableRemoteMethod('__create__ptfs', false);
  InsertComment.disableRemoteMethod('__delete__ptfs', false);
  InsertComment.disableRemoteMethod('__destroyById__ptfs', false);
  InsertComment.disableRemoteMethod('__findById__ptfs', false);
  InsertComment.disableRemoteMethod('__updateById__ptfs', false);

  InsertComment.disableRemoteMethod('__exists__ptfs', false);
  InsertComment.disableRemoteMethod('__link__ptfs', false);
  InsertComment.disableRemoteMethod('__unlink__ptfs', false);

  // pes methods
  InsertComment.disableRemoteMethod('__get__pes', false);
  InsertComment.disableRemoteMethod('__count__pes', false);
  InsertComment.disableRemoteMethod('__create__pes', false);
  InsertComment.disableRemoteMethod('__delete__pes', false);
  InsertComment.disableRemoteMethod('__destroyById__pes', false);
  InsertComment.disableRemoteMethod('__findById__pes', false);
  InsertComment.disableRemoteMethod('__updateById__pes', false);

  InsertComment.disableRemoteMethod('__exists__pes', false);
  InsertComment.disableRemoteMethod('__link__pes', false);
  InsertComment.disableRemoteMethod('__unlink__pes', false);

  // wishes methods
  InsertComment.disableRemoteMethod('__get__wishes', false);
  InsertComment.disableRemoteMethod('__count__wishes', false);
  InsertComment.disableRemoteMethod('__create__wishes', false);
  InsertComment.disableRemoteMethod('__delete__wishes', false);
  InsertComment.disableRemoteMethod('__destroyById__wishes', false);
  InsertComment.disableRemoteMethod('__findById__wishes', false);
  InsertComment.disableRemoteMethod('__updateById__wishes', false);

  InsertComment.disableRemoteMethod('__exists__wishes', false);
  InsertComment.disableRemoteMethod('__link__wishes', false);
  InsertComment.disableRemoteMethod('__unlink__wishes', false);

  // disable tags
  InsertComment.disableRemoteMethod('__get__tags', false);
  InsertComment.disableRemoteMethod('__count__tags', false);
  InsertComment.disableRemoteMethod('__create__tags', false);
  InsertComment.disableRemoteMethod('__delete__tags', false);
  InsertComment.disableRemoteMethod('__destroyById__tags', false);
  InsertComment.disableRemoteMethod('__findById__tags', false);
  InsertComment.disableRemoteMethod('__updateById__tags', false);

  InsertComment.disableRemoteMethod('__exists__tags', false);
  InsertComment.disableRemoteMethod('__link__tags', false);
  InsertComment.disableRemoteMethod('__unlink__tags', false);

  InsertComment.resultV2 = function(meplId, comment, cb) {
    let reg = /^\d+$/;
    if (reg.test(meplId)) {
      insertc.insertComment(meplId, comment, function(err, result) {
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
  InsertComment.remoteMethod(
    'resultV2', {
      accepts: [{
        arg: 'meplId',
        type: 'string',
      },
      {
        arg: 'comment',
        type: 'string'}],
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
