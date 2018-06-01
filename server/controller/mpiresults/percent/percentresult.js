'use strict';

let _ = require('lodash');
let pluck = require('lodash.pluck');

let getPercent = function(release, subRelease, meplId, meplitem, hist, aparsSet, callbackall) {
  let percentageres = 100;
  let rsuObj = [];
  (meplitem).forEach(function(meplitemIdx) {
    let module = meplitemIdx.MODULE;
    let ptfId = meplitemIdx.PTFID;
    let history = hist[module];
    if (history !== undefined) {
      let hi = _.find(history, {'PTFID': ptfId});
      if (hi !== undefined) {
        let tmp = aparsSet[hi.APARID];
        if (tmp !== undefined) {
          let closeDate = tmp.CLOSEDATE;
          rsuObj.push(closeDate);
        }
      }
    }
  });
  console.log(rsuObj);
  callbackall(percentageres);
  // callbackall(inconsistentresult);
};

exports.getPercent = getPercent;
