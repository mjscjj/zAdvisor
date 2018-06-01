'use strict';

let _ = require('lodash');
let pluck = require('lodash.pluck');
/**
 * @ignore  =====================================================================================
 * @file for detecting inconsistencies in the client mepl
 * @input:
 * release, subRelease (eg: A.1, release is 'A', subRelease is '1'), meplId
 * relation: get the relationship of apar, module, ptf
 * hist: reorganized from relation map module and the other info got from the relation
 * hitmodule: the ptf is hit on those modules
 * meplModel: the map of module and ptfid
 * @output:
 * inconsistentresult: json of inconsistent result
 *
 * @algorithm:
 * This function retrieves the inconsistencies in the modules
 * Inconsistency is when:
 * o module A is at ptf p3.
 * o p3 hits module B as well
 * o module B is at a ptf level lower than p3
 * Algorithm is as follows:
 *  For every ptf level (level1) in the mepl
 *   - find all modules the ptf hits
 *   - for each of the modules that are hit
 *     - If the ptf level (level2) is at least as high as (level1) then it is fine
 *       Otherwise, it is marked as an inconsistency
 *
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let getInconsistancies = function(release, subRelease, meplId, meplitem, relation, hist, hitmodule, meplModel, callbackall) {
  // data.getdata(release, subRelease, meplId, function(meplitem, relation, hist, hitmodule, meplModel) {
  let inconsistancies = [];
  // console.log(hist);
  _(relation).forEach(function(item) {
    hist[item.MODULE] = _.uniqBy(hist[item.MODULE], function(obj) {
      return obj.PTFID;
    });
  });
  _(meplitem).forEach(function(meplsIdx) {
    let history = hist[meplsIdx.MODULE];
    // find the rank of this mepl
    let rank = -2;
    if (meplsIdx.PTFID !== null && meplsIdx !== undefined && meplsIdx.PTFID !== undefined) {
      let tmp = _.find(history, {'PTFID': meplsIdx.PTFID});
      rank = (tmp !== undefined) ? tmp.RANK : -2;
    }
    if (rank > 0) {
      _(history).forEach(function(historyIdx) {
        if (historyIdx.RANK >= rank) {
          let modulesHit = hitmodule[historyIdx.PTFID];
          if (modulesHit !== undefined) {
            // check the level of the modules referencing the algorithm
            _(modulesHit).forEach(function(modulesHitIdx) {
              let ptfidexpected = historyIdx.PTFID;
              let modulehit = modulesHitIdx.MODULE;
              let meplModPtfid = meplModel[modulehit];
              let hitmodule = hist[modulehit];
              let checkhistptf = false;
              if (ptfidexpected === undefined || meplModPtfid === undefined) {
                checkhistptf = false;
              } else {
                // get the rank of meplmod's ptfid
                let temp1 = _.find(hitmodule, {'PTFID': meplModPtfid});
                let meplModPtfidrank = (temp1 !== undefined) ? temp1.RANK : -2;
                // get the rank of expected ptdid
                let temp2 = _.find(hitmodule, {'PTFID': ptfidexpected});
                let ptfidexpectedrank = (temp2 !== undefined) ? temp2.RANK : -2;
                // expected rank is bigger than meplMod's rank not inconsistent
                if (ptfidexpectedrank !== -2 && ptfidexpectedrank >= meplModPtfidrank) {
                  checkhistptf = true;
                }
              }
              let check = (meplModPtfid === ptfidexpected) || checkhistptf;
              let checkStatus = (hitmodule === undefined || meplModPtfid === undefined) ? true : check;
              if (checkStatus === false) {
                if (meplModPtfid !== undefined) {
                  let obj = {};
                  obj.Modulehit = modulehit;
                  obj.Ptfiderror = meplModPtfid;
                  obj.Ptfidexpected = ptfidexpected;
                  obj.Moduleevidence = meplsIdx.MODULE;
                  obj.Ptfidmepl = meplsIdx.PTFID;
                  inconsistancies.push(obj);
                }
              }
            });
          }
        }
      });
    }
  });
  inconsistancies = _.uniqBy(inconsistancies, function(obj) {
    return obj.Modulehit;
  });
  // console.log(inconsistancies)
  callbackall(inconsistancies);
  // callbackall(inconsistentresult);
};

exports.getInconsistancies = getInconsistancies;
