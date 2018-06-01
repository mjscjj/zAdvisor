'use strict';

let deletec = require('../../server/controller/reportsComments/deleteComment');
module.exports = (DeleteComment) => {
  DeleteComment.disableRemoteMethodByName('find');
  DeleteComment.disableRemoteMethod('findById', true);
  DeleteComment.disableRemoteMethod('findOne', true);

  // disable count & exists
  DeleteComment.disableRemoteMethod('confirm', true);
  DeleteComment.disableRemoteMethod('count', true);
  DeleteComment.disableRemoteMethod('exists', true);

  DeleteComment.disableRemoteMethod('create', true);
  DeleteComment.disableRemoteMethod('upsert', true);
  DeleteComment.disableRemoteMethod('deleteById', true);
  DeleteComment.disableRemoteMethod('updateAll', true);
  DeleteComment.disableRemoteMethod('updateAttributes', false);
  DeleteComment.disableRemoteMethod('createChangeStream', true);

  DeleteComment.disableRemoteMethod('replaceById', true);
  DeleteComment.disableRemoteMethod('replaceOrCreate', true);
  DeleteComment.disableRemoteMethod('upsertWithWhere', true);

  // ptfs methods
  DeleteComment.disableRemoteMethod('__get__ptfs', false);
  DeleteComment.disableRemoteMethod('__count__ptfs', false);
  DeleteComment.disableRemoteMethod('__create__ptfs', false);
  DeleteComment.disableRemoteMethod('__delete__ptfs', false);
  DeleteComment.disableRemoteMethod('__destroyById__ptfs', false);
  DeleteComment.disableRemoteMethod('__findById__ptfs', false);
  DeleteComment.disableRemoteMethod('__updateById__ptfs', false);

  DeleteComment.disableRemoteMethod('__exists__ptfs', false);
  DeleteComment.disableRemoteMethod('__link__ptfs', false);
  DeleteComment.disableRemoteMethod('__unlink__ptfs', false);

  // pes methods
  DeleteComment.disableRemoteMethod('__get__pes', false);
  DeleteComment.disableRemoteMethod('__count__pes', false);
  DeleteComment.disableRemoteMethod('__create__pes', false);
  DeleteComment.disableRemoteMethod('__delete__pes', false);
  DeleteComment.disableRemoteMethod('__destroyById__pes', false);
  DeleteComment.disableRemoteMethod('__findById__pes', false);
  DeleteComment.disableRemoteMethod('__updateById__pes', false);

  DeleteComment.disableRemoteMethod('__exists__pes', false);
  DeleteComment.disableRemoteMethod('__link__pes', false);
  DeleteComment.disableRemoteMethod('__unlink__pes', false);

  // wishes methods
  DeleteComment.disableRemoteMethod('__get__wishes', false);
  DeleteComment.disableRemoteMethod('__count__wishes', false);
  DeleteComment.disableRemoteMethod('__create__wishes', false);
  DeleteComment.disableRemoteMethod('__delete__wishes', false);
  DeleteComment.disableRemoteMethod('__destroyById__wishes', false);
  DeleteComment.disableRemoteMethod('__findById__wishes', false);
  DeleteComment.disableRemoteMethod('__updateById__wishes', false);

  DeleteComment.disableRemoteMethod('__exists__wishes', false);
  DeleteComment.disableRemoteMethod('__link__wishes', false);
  DeleteComment.disableRemoteMethod('__unlink__wishes', false);

  // disable tags
  DeleteComment.disableRemoteMethod('__get__tags', false);
  DeleteComment.disableRemoteMethod('__count__tags', false);
  DeleteComment.disableRemoteMethod('__create__tags', false);
  DeleteComment.disableRemoteMethod('__delete__tags', false);
  DeleteComment.disableRemoteMethod('__destroyById__tags', false);
  DeleteComment.disableRemoteMethod('__findById__tags', false);
  DeleteComment.disableRemoteMethod('__updateById__tags', false);

  DeleteComment.disableRemoteMethod('__exists__tags', false);
  DeleteComment.disableRemoteMethod('__link__tags', false);
  DeleteComment.disableRemoteMethod('__unlink__tags', false);

  DeleteComment.resultV2 = function(commentId, cb) {
    let reg = /^\d+$/;
    if (reg.test(commentId)) {
      deletec.deleteComment(commentId, function(err, result) {
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
  DeleteComment.remoteMethod(
    'resultV2', {
      accepts: [{
        arg: 'commentId',
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
