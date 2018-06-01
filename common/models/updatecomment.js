'use strict';

let updatec = require('../../server/controller/reportsComments/updateComment');
module.exports = (UpdateComment) => {
  UpdateComment.disableRemoteMethodByName('find');
  UpdateComment.disableRemoteMethod('findById', true);
  UpdateComment.disableRemoteMethod('findOne', true);

  // disable count & exists
  UpdateComment.disableRemoteMethod('confirm', true);
  UpdateComment.disableRemoteMethod('count', true);
  UpdateComment.disableRemoteMethod('exists', true);

  UpdateComment.disableRemoteMethod('create', true);
  UpdateComment.disableRemoteMethod('upsert', true);
  UpdateComment.disableRemoteMethod('deleteById', true);
  UpdateComment.disableRemoteMethod('updateAll', true);
  UpdateComment.disableRemoteMethod('updateAttributes', false);
  UpdateComment.disableRemoteMethod('createChangeStream', true);

  UpdateComment.disableRemoteMethod('replaceById', true);
  UpdateComment.disableRemoteMethod('replaceOrCreate', true);
  UpdateComment.disableRemoteMethod('upsertWithWhere', true);

  // ptfs methods
  UpdateComment.disableRemoteMethod('__get__ptfs', false);
  UpdateComment.disableRemoteMethod('__count__ptfs', false);
  UpdateComment.disableRemoteMethod('__create__ptfs', false);
  UpdateComment.disableRemoteMethod('__delete__ptfs', false);
  UpdateComment.disableRemoteMethod('__destroyById__ptfs', false);
  UpdateComment.disableRemoteMethod('__findById__ptfs', false);
  UpdateComment.disableRemoteMethod('__updateById__ptfs', false);

  UpdateComment.disableRemoteMethod('__exists__ptfs', false);
  UpdateComment.disableRemoteMethod('__link__ptfs', false);
  UpdateComment.disableRemoteMethod('__unlink__ptfs', false);

  // pes methods
  UpdateComment.disableRemoteMethod('__get__pes', false);
  UpdateComment.disableRemoteMethod('__count__pes', false);
  UpdateComment.disableRemoteMethod('__create__pes', false);
  UpdateComment.disableRemoteMethod('__delete__pes', false);
  UpdateComment.disableRemoteMethod('__destroyById__pes', false);
  UpdateComment.disableRemoteMethod('__findById__pes', false);
  UpdateComment.disableRemoteMethod('__updateById__pes', false);

  UpdateComment.disableRemoteMethod('__exists__pes', false);
  UpdateComment.disableRemoteMethod('__link__pes', false);
  UpdateComment.disableRemoteMethod('__unlink__pes', false);

  // wishes methods
  UpdateComment.disableRemoteMethod('__get__wishes', false);
  UpdateComment.disableRemoteMethod('__count__wishes', false);
  UpdateComment.disableRemoteMethod('__create__wishes', false);
  UpdateComment.disableRemoteMethod('__delete__wishes', false);
  UpdateComment.disableRemoteMethod('__destroyById__wishes', false);
  UpdateComment.disableRemoteMethod('__findById__wishes', false);
  UpdateComment.disableRemoteMethod('__updateById__wishes', false);

  UpdateComment.disableRemoteMethod('__exists__wishes', false);
  UpdateComment.disableRemoteMethod('__link__wishes', false);
  UpdateComment.disableRemoteMethod('__unlink__wishes', false);

  // disable tags
  UpdateComment.disableRemoteMethod('__get__tags', false);
  UpdateComment.disableRemoteMethod('__count__tags', false);
  UpdateComment.disableRemoteMethod('__create__tags', false);
  UpdateComment.disableRemoteMethod('__delete__tags', false);
  UpdateComment.disableRemoteMethod('__destroyById__tags', false);
  UpdateComment.disableRemoteMethod('__findById__tags', false);
  UpdateComment.disableRemoteMethod('__updateById__tags', false);

  UpdateComment.disableRemoteMethod('__exists__tags', false);
  UpdateComment.disableRemoteMethod('__link__tags', false);
  UpdateComment.disableRemoteMethod('__unlink__tags', false);

  UpdateComment.resultV2 = function(comment, commentId, cb) {
    let reg = /^\d+$/;
    if (reg.test(commentId)) {
      updatec.updateComment(comment, commentId, function(err, result) {
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
  UpdateComment.remoteMethod(
    'resultV2', {
      accepts: [{
        arg: 'comment',
        type: 'string',
      },
      {
        arg: 'commentId',
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
