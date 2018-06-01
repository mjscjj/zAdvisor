'use strict';

let mpi = require('../../server/controller/mpiresults/results');
let searchRS = require('../../server/controller/mpiresults/searchReleaseSub');
module.exports = (MPIresults) => {
  MPIresults.disableRemoteMethodByName('find');
  MPIresults.disableRemoteMethod('findById', true);
  MPIresults.disableRemoteMethod('findOne', true);

  // disable count & exists
  MPIresults.disableRemoteMethod('confirm', true);
  MPIresults.disableRemoteMethod('count', true);
  MPIresults.disableRemoteMethod('exists', true);

  MPIresults.disableRemoteMethod('create', true);
  MPIresults.disableRemoteMethod('upsert', true);
  MPIresults.disableRemoteMethod('deleteById', true);
  MPIresults.disableRemoteMethod('updateAll', true);
  MPIresults.disableRemoteMethod('updateAttributes', false);
  MPIresults.disableRemoteMethod('createChangeStream', true);

  MPIresults.disableRemoteMethod('replaceById', true);
  MPIresults.disableRemoteMethod('replaceOrCreate', true);
  MPIresults.disableRemoteMethod('upsertWithWhere', true);

  // ptfs methods
  MPIresults.disableRemoteMethod('__get__ptfs', false);
  MPIresults.disableRemoteMethod('__count__ptfs', false);
  MPIresults.disableRemoteMethod('__create__ptfs', false);
  MPIresults.disableRemoteMethod('__delete__ptfs', false);
  MPIresults.disableRemoteMethod('__destroyById__ptfs', false);
  MPIresults.disableRemoteMethod('__findById__ptfs', false);
  MPIresults.disableRemoteMethod('__updateById__ptfs', false);

  MPIresults.disableRemoteMethod('__exists__ptfs', false);
  MPIresults.disableRemoteMethod('__link__ptfs', false);
  MPIresults.disableRemoteMethod('__unlink__ptfs', false);

  // pes methods
  MPIresults.disableRemoteMethod('__get__pes', false);
  MPIresults.disableRemoteMethod('__count__pes', false);
  MPIresults.disableRemoteMethod('__create__pes', false);
  MPIresults.disableRemoteMethod('__delete__pes', false);
  MPIresults.disableRemoteMethod('__destroyById__pes', false);
  MPIresults.disableRemoteMethod('__findById__pes', false);
  MPIresults.disableRemoteMethod('__updateById__pes', false);

  MPIresults.disableRemoteMethod('__exists__pes', false);
  MPIresults.disableRemoteMethod('__link__pes', false);
  MPIresults.disableRemoteMethod('__unlink__pes', false);

  // wishes methods
  MPIresults.disableRemoteMethod('__get__wishes', false);
  MPIresults.disableRemoteMethod('__count__wishes', false);
  MPIresults.disableRemoteMethod('__create__wishes', false);
  MPIresults.disableRemoteMethod('__delete__wishes', false);
  MPIresults.disableRemoteMethod('__destroyById__wishes', false);
  MPIresults.disableRemoteMethod('__findById__wishes', false);
  MPIresults.disableRemoteMethod('__updateById__wishes', false);

  MPIresults.disableRemoteMethod('__exists__wishes', false);
  MPIresults.disableRemoteMethod('__link__wishes', false);
  MPIresults.disableRemoteMethod('__unlink__wishes', false);

  // disable tags
  MPIresults.disableRemoteMethod('__get__tags', false);
  MPIresults.disableRemoteMethod('__count__tags', false);
  MPIresults.disableRemoteMethod('__create__tags', false);
  MPIresults.disableRemoteMethod('__delete__tags', false);
  MPIresults.disableRemoteMethod('__destroyById__tags', false);
  MPIresults.disableRemoteMethod('__findById__tags', false);
  MPIresults.disableRemoteMethod('__updateById__tags', false);

  MPIresults.disableRemoteMethod('__exists__tags', false);
  MPIresults.disableRemoteMethod('__link__tags', false);
  MPIresults.disableRemoteMethod('__unlink__tags', false);

  MPIresults.resultV2 = function(meplId, cb) {
    searchRS.getReleaseSub(meplId, function(err, meplRelease) {
      if (err !== null) {
        let result = {};
        result.errorMessage = err;
        cb(null, result);
      } else {
        let release = null;
        let subRelease = null;
        if (meplRelease !== undefined && meplRelease[0] !== undefined) {
          release = meplRelease[0].RELEASE;
          subRelease = meplRelease[0].SUBRELEASE;
        }
        // console.log(meplRelease);
        if (release !== '' && subRelease !== '' && meplId !== '' && release !== null && subRelease !== null && meplId !== null && release !== undefined && subRelease !== undefined && meplId !== undefined) {
          // console.log('sos');
          let reg = /^\d+$/;
          let regAlpha = /^[a-zA-Z\d]+$/;
          if (reg.test(meplId) === true && regAlpha.test(release) === true && reg.test(subRelease) === true) {
            // console.log('aaaa')
            mpi.result(release, subRelease, meplId, function (err, hiper, peres, inconsistentres) {
              // console.log(hiper);
              if (hiper === -1 || peres === -1 || inconsistentres === -1 || err !== null) {
                // console.log('pppp');
                let result = {};
                result.errorMessage = err;
                cb(null, result);
              } else {
                let result = {};
                result.hiper = hiper;
                result.peres = peres;
                result.inconsistentres = inconsistentres;
                result.errorMessage = null;
                // console.log(result);
                cb(null, result);
              }
            });
          } else {
            let result = {};
            result.hiper = [];
            result.peres = [];
            result.inconsistentres = [];
            result.errorMessage = null;
            cb(null, result);
          }
        } else {
          // console.log('sspsps');
          let result = {};
          result.hiper = [];
          result.peres = [];
          result.inconsistentres = [];
          result.errorMessage = null;
          cb(null, result);
        }
      }
    });
  };
  MPIresults.remoteMethod(
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
