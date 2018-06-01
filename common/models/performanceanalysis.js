'use strict';

let analysis = require('../../server/controller/performanceAnalysis/analysis');
module.exports = (PerformanceAnalysis) => {
  PerformanceAnalysis.disableRemoteMethodByName('find');
  PerformanceAnalysis.disableRemoteMethod('findById', true);
  PerformanceAnalysis.disableRemoteMethod('findOne', true);

  // disable count & exists
  PerformanceAnalysis.disableRemoteMethod('confirm', true);
  PerformanceAnalysis.disableRemoteMethod('count', true);
  PerformanceAnalysis.disableRemoteMethod('exists', true);

  PerformanceAnalysis.disableRemoteMethod('create', true);
  PerformanceAnalysis.disableRemoteMethod('upsert', true);
  PerformanceAnalysis.disableRemoteMethod('deleteById', true);
  PerformanceAnalysis.disableRemoteMethod('updateAll', true);
  PerformanceAnalysis.disableRemoteMethod('updateAttributes', false);
  PerformanceAnalysis.disableRemoteMethod('createChangeStream', true);

  PerformanceAnalysis.disableRemoteMethod('replaceById', true);
  PerformanceAnalysis.disableRemoteMethod('replaceOrCreate', true);
  PerformanceAnalysis.disableRemoteMethod('upsertWithWhere', true);

  // ptfs methods
  PerformanceAnalysis.disableRemoteMethod('__get__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__count__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__create__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__delete__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__destroyById__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__findById__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__updateById__ptfs', false);

  PerformanceAnalysis.disableRemoteMethod('__exists__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__link__ptfs', false);
  PerformanceAnalysis.disableRemoteMethod('__unlink__ptfs', false);

  // pes methods
  PerformanceAnalysis.disableRemoteMethod('__get__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__count__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__create__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__delete__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__destroyById__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__findById__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__updateById__pes', false);

  PerformanceAnalysis.disableRemoteMethod('__exists__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__link__pes', false);
  PerformanceAnalysis.disableRemoteMethod('__unlink__pes', false);

  // wishes methods
  PerformanceAnalysis.disableRemoteMethod('__get__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__count__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__create__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__delete__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__destroyById__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__findById__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__updateById__wishes', false);

  PerformanceAnalysis.disableRemoteMethod('__exists__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__link__wishes', false);
  PerformanceAnalysis.disableRemoteMethod('__unlink__wishes', false);

  // disable tags
  PerformanceAnalysis.disableRemoteMethod('__get__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__count__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__create__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__delete__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__destroyById__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__findById__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__updateById__tags', false);

  PerformanceAnalysis.disableRemoteMethod('__exists__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__link__tags', false);
  PerformanceAnalysis.disableRemoteMethod('__unlink__tags', false);

  PerformanceAnalysis.resultV2 = function(userId, userTime, userArea, userFunction, cb) {
    analysis.analysisData(userId, userTime, userArea, userFunction, function(err, result) {
      let obj = {};
      obj.errorMessage = err;
      obj.result = result;
      cb(null, obj);
    });
  };
  PerformanceAnalysis.remoteMethod(
    'resultV2', {
      accepts: [{
        arg: 'userId',
        type: 'string',
      },
      {
        arg: 'userTime',
        type: 'string'},
      {
        arg: 'userArea',
        type: 'string'},
      {
        arg: 'userFunction',
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
