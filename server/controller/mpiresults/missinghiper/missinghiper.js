'use strict';

let _ = require('lodash');
let pluck = require('lodash.pluck');
/**
 * @ignore  =====================================================================================
 * @file for detecting missing hipers in the client mepl
 * @input:
 * meplId
 * meplitem: get mepl from meplitems_a by meplid
 * hist: reorganized from relation map module and the other info got from the relation
 * aparsSet: apars from apar table
 * @output:
 * mishiper: json of missinghiper result
 *
 * @algorithm:
 * Gets the hipers for this mepl which is missing
 *
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let getmishiper = function(meplitem, hist, aparsSet, callbackall) {
  let mishiper = [];
  _(meplitem).forEach(function(meplsIdx) {
    let history = hist[meplsIdx.MODULE];
    let rank = -2;
    if (meplsIdx.PTFID !== null && meplsIdx !== undefined && meplsIdx.PTFID !== undefined) {
      let tmp = _.find(history, {'PTFID': meplsIdx.PTFID});
      rank = (tmp !== undefined) ? tmp.RANK : -2;
    } else {
      // go to the bottom of history
      let tmp = [];
      tmp = pluck(history, 'RANK');
      tmp.push(-2);
      rank = (tmp !== undefined) ? (_.max(tmp) + 1) : -2;
    }
    if (rank > 0) {
      _(history).forEach(function(historyIdx) {
        if (historyIdx.RANK < rank) {
          let apars = aparsSet[historyIdx.APARID];
          // console.log(apars);
          if (apars !== undefined && apars.HIPER === 1) {
            let hiper = {};
            hiper.Module = meplsIdx.MODULE;
            hiper.AparID = apars.APARID;
            if (historyIdx.PTFID !== null) {
              hiper.PTFID = historyIdx.PTFID;
            } else {
              historyIdx.PTFID = 'NO FIX AVAIL';
            }
            hiper.Summary = apars.SUMMARY;
            hiper.CloseDate = apars.CLOSEDATE;
            hiper.Severity = apars.SEVERITY;
            mishiper.push(hiper);
          }
        }
      });
    }
  });
  mishiper = _.uniqBy(mishiper, function(obj) {
    return obj.AparID;
  });
  // callbackall(mishiperresult);
  callbackall(mishiper);
};

exports.getmishiper = getmishiper;
