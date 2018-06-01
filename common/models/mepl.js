'use strict';

/**
 * @ignore  =====================================================================================
 * @file mepl update, hiper missing/pe missing/percentage/inconsistent analysis
 * @author  shizy@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2016. All Rights Reserved.
 * @ignore  created in 2016-07-07
 * @ignore  =====================================================================================
 */
let analyze=require('../../server/controller/analyzemepl/styleOne')
let mepl=require('../../server/controller/pmrData/getpmrmepl')
require('../../server/utils/date-format');
const co = require('co');
// var async = require('async');
// var parallel = require('co-parallel');
const Promise = require('bluebird');
const fs = require('fs');
const app = require('../../server/server');
const loopback = require('loopback');
const db2 = require('../../server/utils/db2');
const VError = require('verror');
const logger = require('../../server/utils/logHelper').helper;
const errorHelper = require('../../server/utils/logHelper').helper;
let searchRS = require('../../server/controller/mpiresults/searchReleaseSub');

module.exports = (Mepl) => {
  Mepl.disableRemoteMethodByName('create');
  Mepl.disableRemoteMethodByName('find');
  Mepl.disableRemoteMethodByName('findById');
  Mepl.disableRemoteMethodByName('findOne');

  // disable count & exists
  Mepl.disableRemoteMethodByName('confirm');
  Mepl.disableRemoteMethodByName('count');
  Mepl.disableRemoteMethodByName('exists');

  Mepl.disableRemoteMethodByName('create');
  Mepl.disableRemoteMethodByName('upsert');
  Mepl.disableRemoteMethodByName('deleteById');
  Mepl.disableRemoteMethodByName('updateAll');
  Mepl.disableRemoteMethodByName('updateAttributes');
  Mepl.disableRemoteMethodByName('createChangeStream');

  Mepl.disableRemoteMethodByName('replaceById');
  Mepl.disableRemoteMethodByName('replaceOrCreate');
  Mepl.disableRemoteMethodByName('upsertWithWhere');
  // instance methods
  Mepl.disableRemoteMethodByName('prototype.__get__meplItems');
  Mepl.disableRemoteMethodByName('prototype.__count__meplItems');
  Mepl.disableRemoteMethodByName('prototype.__create__meplItems');
  Mepl.disableRemoteMethodByName('prototype.__delete__meplItems');
  Mepl.disableRemoteMethodByName('prototype.__destroyById__meplItems');
  Mepl.disableRemoteMethodByName('prototype.__findById__meplItems');
  Mepl.disableRemoteMethodByName('prototype.__updateById__meplItems');

  Mepl.disableRemoteMethodByName('__exists__MeplItem');
  Mepl.disableRemoteMethodByName('__link__MeplItem');
  Mepl.disableRemoteMethodByName('__unlink__MeplItem');
  /* example MEPL lines
   * Default MEPL:
   * '     0000 00BA0000 D4C5D7D3 00840EB5 0001D6C0  00000000 00000000 00000000 00000000    *....MEPL......O.................*'
   * IPCS MEPL Dump:
   * '     0000  00BA0000 D4C5D7D3 00840DBF 0001B800  00000000 00000000 00000000 00000000  *....MEPL........................*'
   */
  const MEPL_START_TEXT = '    0000 00BA0000 D4C5D7D3';
  const MEPL_MODULE_COUNT_START = 27;
  const MEPL_MODULE_COUNT_LEN = 4;
  const MEPL_MODULE_NAME_START = 86;
  const MEPL_MODULE_NAME_LEN = 8;
  const MEPL_CSECT_COUNT_START = 50;
  const MEPL_CSECT_COUNT_LEN = 4;
  const MEPL_CSECT_NAME_START = 90;
  const MEPL_CSECT_NAME_LEN = 8;
  const MEPL_CSECT_LEVEL_START = 106;
  const MEPL_CSECT_LEVEL_LEN = 7;

  /**
   * @description
   * scan mepl items
   * @param id {String} Identifier of mepl (primary key value).
   * @param results {Array} empty array that push qualified object into it
   * @param cb {Function} invoked as cb(apar, results), where `apar` is a Model Apar object.
   *                      Based on different strategy, we push apar into results or not.
   * @throws {Error} Mepl not found (err1)
   * @returns {Promise}
   */
  function scanMepl(id, results, cb) {
    return new Promise((resolve, reject) => {
      Mepl.findById(id, {
      include: 'meplItems',
    }).then((mepl) => {
      if (!mepl) {
      const err1 = new Error('Mepl not found');
      err1.status = 400;
      err1.code = 'MEPL_NOT_FOUND';
      throw err1;
    }

    const version = `${mepl.release}.${mepl.subRelease}`;
    const csects = db2.csects;
    const apars = db2.apars;

    for (let i = 0; i < mepl.meplItems().length; i += 1) {
      const hist = csects[version].get(mepl.meplItems()[i].csect);

      if (!hist) {
        // find the location for current level
        let idx = 0;
        for (idx = 0; idx < hist.length; idx += 1) {
          if (mepl.meplItems()[i].ptfId !== undefined &&
            mepl.meplItems()[i].ptfId === hist[idx].ptfId) {
            break;
          }
        }
        // if search to the end and do not find matching level,
        // it means csect level is very new and even not exists in
        // csect history. No missing hiper apars for this csect.
        if (idx === hist.length) {
          idx = 0;
        }

        for (let j = 0; j < idx; j += 1) {
          const apar = apars.get(hist[j].aparId);

          cb(apar, results);
        }
      }
    }
    resolve(results);
  }).catch((err) => {
      reject(err);
  });
  });
  }

  /**
   * @description
   * mepl parser during upload
   * @param userId {String} Identifier of logged-in user (primary key value).
   * @param meplString {String} meplString uploaded mepl string
   * @param cb {Function} invoked when fetching the apar succeeds or fails.  Upon
   *                   success, callback is invoked as cb(null, apar),
   *                   where `apar` is a Model Apar object.  Upon failure,
   *                   callback is invoked as cb(err) instead.
   * @throws {Error} Mepl not found (err1)
   *         {Error} error while find/update from data source, etc, TIMEOUT, ECONNREFUSED
   (err3, err4, err5)
   * @returns {Promise}
   */
  function parse(userId, txt, cb) {
    const MeplItem = app.models.MeplItem;
    // let start;
    // let diff;
    // let ms;
    const versionCount = new Map();
    const ptfs = db2.ptfs;

    db2.read((err) => {
      if (err) return cb(err);

    let tx;
    let meplString;
    co(function* doParse() {
      tx = yield Mepl.beginTransaction({
        isolationLevel: Mepl.Transaction.READ_COMMITTED,
      });
      const mepl = yield Mepl.create({
        ownerId: userId,
        release: '0',
        subRelease: 0,
        created: Date.now(),
      }, {
        transaction: tx,
      });

      // get substring from mepl start;
      const meplStart = txt.indexOf(MEPL_START_TEXT);
      if (meplStart < 0) {
        const err1 = new Error('Mepl format error');
        err1.status = 400;
        err1.code = 'MEPL_PARSE_FAIL';
        throw err1;
      } else {
        meplString = txt.substring(meplStart);
      }

      // split
      const lines = meplString.split('\r\n');
      // get module count
      let moduleCount = 0;
      let moduleName = '';
      let csectName = '';
      let csectCount = 0;
      let csectLevel = '';
      const meplItemArray = [];

      moduleCount = parseInt(lines[0].substr(MEPL_MODULE_COUNT_START, MEPL_MODULE_COUNT_LEN), 16);

      for (let i = 0, lineIndex = 1; i < moduleCount; i += 1) {
        moduleName = lines[lineIndex].substr(MEPL_MODULE_NAME_START, MEPL_MODULE_NAME_LEN).trim();
        csectCount = parseInt(
          lines[lineIndex]
            .substr(MEPL_CSECT_COUNT_START, MEPL_CSECT_COUNT_LEN), 16);
        lineIndex += 1;

        for (let j = 0; j < csectCount; j += 1) {
          csectName = lines[lineIndex]
            .substr(MEPL_CSECT_NAME_START, MEPL_CSECT_NAME_LEN)
            .trim();
          csectLevel = lines[lineIndex]
            .substr(MEPL_CSECT_LEVEL_START, MEPL_CSECT_LEVEL_LEN)
            .trim();

          lineIndex += 1;

          // all ptfId should be start with 'U'
          if (csectLevel.substr(0, 1) !== 'U') {
            csectLevel = undefined;
          } else if (csectName.substr(0, 4) === 'DSNI' || csectName.substr(0, 4) === 'DSNB' || csectName.substr(0, 4) === 'DSNX') {
            // accumulate version count for csect level(ptfId)
            const version = ptfs.get(csectLevel).version;

            if (!versionCount.has(version)) {
              versionCount.set(version, 1);
            } else {
              versionCount.set(version, versionCount.get(version) + 1);
            }
          }


          meplItemArray.push({
            meplId: mepl.id,
            module: moduleName,
            csect: csectName,
            ptfId: csectLevel,
          });
        }
      }

      // find the version of max count
      // TODO: mepl file can have different version??
      let currentVersion = '';
      let num = 0;
      versionCount.forEach((value, key) => {
        if (value > num) {
        num = value;
        currentVersion = key;
      }
    });

      // update release/subRelease
      yield mepl.updateAttributes({
        release: currentVersion.substr(0, 1),
        subRelease: parseInt(currentVersion.substr(2, 1), 10),
      }, {
        transaction: tx,
      });

      // insert all mepl items
      yield MeplItem.create(meplItemArray, {
        transaction: tx,
      });

      return mepl;
    }).then((val) => {
      tx.commit();
    cb(null, val);
  }, (err2) => {
      if (tx) {
        tx.rollback();
      }

      const error = new VError(err2, 'Mepl Parse Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err2));
    });

    return true;
  });
  }

  Mepl.uploadByTextfile_v1 = (req, cb) => {
    // req.file is the `recfile` file
    const rs = fs.createReadStream(req.file.path, {
      encoding: 'utf-8',
    });
    let data = '';

    rs.on('data', (trunk) => {
      data += trunk;
  });
    rs.on('end', () => {
      fs.unlink(req.file.path, (err) => {
      if (err) {
        logger.writeErr('Delete original file Error: ', err);
      }
    });

    // parse mepl and save mepl/meplItem
    const ctx = loopback.getCurrentContext();
    const accessToken = ctx.get('accessToken');
    parse(accessToken.userId, data, cb);
    // parse(1, data, cb);
  });
  };

  Mepl.remoteMethod(
    'uploadByTextfile_v1', {
      accepts: [{
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
        path: '/v1/upload/file',
        verb: 'post',
      },
    }
  );

  Mepl.hiperReport_v1 = (id, req, cb) => {
    db2.read((err) => {
      if (err) {
        cb(err);
      }

      co(function* doHiperReport() {
      const missing = new Map();

      yield scanMepl(id, missing, (apar, results) => {
        if (apar !== undefined && apar.hiper && !results.has(apar.aparId)) {
        results.set(apar.aparId, apar);
      }
    });

      const ret = [];
      for (const elem of missing.values()) {
        ret.push(elem);
      }

      return ret;
    }).then((val) => {
      cb(null, val);
  }, (err3) => {
      const error = new VError(err3, 'Hiper Report Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err3));
    });
  });
  };

  Mepl.remoteMethod(
    'hiperReport_v1', {
      accepts: [{
        arg: 'id',
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
        path: '/v1/:id/hipers',
        verb: 'get',
      },
    }
  );

  Mepl.peReport_v1 = (id, req, cb) => {
    db2.read((err) => {
      if (err) cb(err);

    co(function* doPeReport() {
      const apars = db2.apars;
      const missing = new Map();

      yield scanMepl(id, missing, (apar, results) => {
        if (apar !== undefined && apar.pes().length > 0 && !results.has(apar.aparId)) {
        results.set(apar.aparId, apar);
      }
    });

      // open Pe
      apars.forEach((apar, key) => {
        if (!apar.closeDate && apar.pes().length > 0) {
        missing.set(key, apar);
      }
    });

      const ret = [];
      for (const elem of missing.values()) {
        ret.push(elem);
      }

      return ret;
    }).then((val) => {
      cb(null, val);
  }, (err4) => {
      const error = new VError(err4, 'Pe Report Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err4));
    });
  });
  };

  Mepl.remoteMethod(
    'peReport_v1', {
      accepts: [{
        arg: 'id',
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
        path: '/v1/:id/pes',
        verb: 'get',
      },
    }
  );

  Mepl.percentageReport_v1 = (id, req, cb) => {
    db2.read((err) => {
      if (err) cb(err);

    co(function* doPercentageReport() {
      const closeDateCount = new Map();

      yield scanMepl(id, closeDateCount, (apar, results) => {
        if (apar !== undefined && apar.closeDate !== undefined) {
        // let dateKey = apar.closeDate.toLocaleDateString('en-US',options);
        const dateKey = apar.closeDate.format('yyyy-MM');

        if (!results.get(dateKey)) {
          results.set(dateKey, 1);
        } else {
          results.set(dateKey, results.get(dateKey) + 1);
        }
      }
    });

      const ret = {};
      closeDateCount.forEach((value, key) => {
        ret[key] = value;
    });

      return ret;
    }).then((val) => {
      cb(null, val);
  }, (err5) => {
      const error = new VError(err5, 'Percentage Report Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err5));
    });
  });
  };

  Mepl.remoteMethod(
    'percentageReport_v1', {
      accepts: [{
        arg: 'id',
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
        path: '/v1/:id/percentage',
        verb: 'get',
      },
    }
  );

  /* TODO: checkPtf is inaccurate
    function checkPtf(array, meplPtfId, targetPtfId) {
      let mIndex, tIndex;
      for (let i = 0; i < array.length; i++) {
        if (meplPtfId === array[i].ptfId)
          mIndex = i;

        if (targetPtfId === array[i].ptfId)
          tIndex = i;
      }

      return mIndex > tIndex;
    }
  */

  function comparePtf(meplPtfId, targetPtfId) {
    // compare 'UI' 'UK'
    if (meplPtfId.substr(0, 2) === targetPtfId.substr(0, 2)) {
      if (meplPtfId.substr(2, 5) < targetPtfId.substr(2, 5)) {
        return true;
      }
      return false;
    } else if (meplPtfId.substr(0, 2) > targetPtfId.substr(0, 2)) {
      return true;
    }

    return false;
  }

  /**
   @todo needs to be fixed
   */
  Mepl.inconsistentReport_v1 = (id, req, cb) => {
    const ret = new Map();

    db2.read((err) => {
      if (err) cb(err);

    co(function* doInconsistentReport() {
      const meplItems = new Map();
      const mepl = yield Mepl.findById(id, {
        include: 'meplItems',
      });

      // first iteration to map pair {csect: ptfId}
      mepl.meplItems().forEach((item) => {
        meplItems.set(item.csect, item.ptfId);
    });

      const ptfs = db2.ptfs;
      const version = `${mepl.release}.${mepl.subRelease}`;
      const csects = db2.csects;
      // const apars = db2.apars;

      // second loop to check if each mepl item is downlevel
      mepl.meplItems().forEach((item) => {
        const hist = csects[version].get(item.csect);
      if (hist !== undefined) {
        // find the location for current level
        let idx = 0;
        for (idx = 0; idx < hist.length; idx++) {
          if (item.ptfId !== undefined && item.ptfId === hist[idx].ptfId) break;
        }
        // if search to the end and do not find matching level,
        // it means csect level is very new and even not exists in
        // csect history. Just skip since it won't be downlevel
        if (idx !== hist.length) {
          // loop ptf history down
          for (let j = idx; j < hist.length; j++) {
            const targetPtf = ptfs.get(hist[j].ptfId);

            targetPtf.csects.forEach((csectName) => {
              if (!ret.get(csectName)) {
              const meplPtfId = meplItems.get(csectName);

              // if item.ptfId > meplPtfId, something wrong and
              // add mepl item into return array
              if (meplPtfId) {
                // let mHist = csects[version].get(csectName);
                // if (checkPtf(mHist, meplPtfId, hist[j].ptfId)) {
                if (comparePtf(meplPtfId, hist[j].ptfId)) {
                  ret.set(csectName, {
                    csect: csectName,
                    ptfId: meplPtfId,
                  });
                }
              }
            }
          });
          }
        }
      }
    });

      return Array.from(ret.values());
    }).then((val) => {
      cb(null, val);
  }, (err6) => {
      const error = new VError(err6, 'Inconsistent Report Error');
      logger.writeErr(JSON.stringify(error), error.stack);
      cb(errorHelper.formatError(err6));
    });
  });
  };

  Mepl.remoteMethod(
    'inconsistentReport_v1', {
      accepts: [{
        arg: 'id',
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
        path: '/v1/:id/inconsistent',
        verb: 'get',
      },
    }
  );

  Mepl.remoteMethod(
    'MeplFromPmr_v1', {
      accepts: [{
        arg: 'pmrid',
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
        path: '/v2/MeplFromPmr',
        verb: 'get',
      },
    }
  );
  Mepl.MeplFromPmr_v1 = (pmrid, req, cb) => {
    mepl.getMeplNameFromPmr(pmrid,function (err,data) {
      if (err) {
        logger.writeErr(JSON.stringify(err),err.stack)
        cb(err)
        return;
      }
      cb(null, data);
    })
  }
  Mepl.DownAnelyzeMepl_v1=(filename,path,req,cb)=>{
    if(path.indexOf(filename)<=0){
      cb('File name and Path inconformity')
      return
    }
    let ftpPath={}
    ftpPath.path_name=path
    ftpPath.name=filename
    mepl.DownMeplUpdataDb(ftpPath,function (err,data) {
      if(err){
        logger.writeErr(JSON.stringify(err),err.stack)
        cb(err)
      return}
      cb(null,data)
      //=============result ============
      let meplId=data.MEPL
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

      //============result end===========
    })

  }
  Mepl.remoteMethod(
    'DownAnelyzeMepl_v1', {
      accepts: [{
        arg: 'filename',
        type: 'string',
        required: true,
      },{
        arg: 'path',
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
        path: '/v2/DownAnelyzeMepl',
        verb: 'get',
      },
    }
  );
};
