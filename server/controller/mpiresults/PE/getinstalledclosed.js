'use strict';

let _ = require('lodash');
/**
 * @ignore  =====================================================================================
 * @file for get the closed pes(have ptf fix but the client missed it) and the installed pes
 * @input:
 * release, subRelease (eg: A.1, release is 'A', subRelease is '1'), meplId
 * meplitem: get mepl from meplitems_a by meplid
 * relation: get the relationship of apar, module, ptf
 * hist: reorganized from relation map module and the other info got from the relation
 * installptfs: the mark of ptfs that is installed on the client
 * peArraySet: peArray from pe table
 * aparsSet: apars from apar table
 * openPePtfs: get open Pe ptfs from db2
 * @output:
 * closedpe: Array of closed pes
 * installedpemap: a map about whether this ptf is on the client
 *
 * @algorithm:
 * the closed pes' rank is smaller than this ptf
 * the installed ptfs' rank is less than or equal to this ptf which means below
 * if the client has a ptf and the older ptfs are all on the client
 *
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let getinstalledclosed = function(meplitem, relation, hist, installptfs, peArraySet, aparsSet, openPePtfs, callbackall) {
  let closedpe = [];
  let installedpe = [];
  _(meplitem).forEach(function(meplsIdx) {
    let history = hist[meplsIdx.MODULE];
    let rank = -2;
    if (meplsIdx.PTFID !== null && meplsIdx !== undefined) {
      let tmp = _.find(history, {'PTFID': meplsIdx.PTFID});
      rank = (tmp !== undefined) ? tmp.RANK : -2;
    }
    if (rank > 0) {
      _(history).forEach(function(historyIdx) {
        if (historyIdx.RANK < rank) {
          let peArray = peArraySet[historyIdx.APARID];
          let apars = aparsSet[historyIdx.APARID];
          if (peArray !== undefined && apars !== undefined) {
            _(peArray).forEach(function(peArrayIdx) {
              let obj = {};
              obj.PTFID = peArrayIdx;
              obj.PtfFix = historyIdx.PTFID;
              obj.AparFix = apars.APARID;
              obj.CloseDate = apars.CLOSEDATE;
              obj.Severity = apars.SEVERITY;
              obj.Summary = apars.SUMMARY;
              let temp = historyIdx.RANK;
              obj.Rank = parseInt(temp);
              closedpe.push(obj);
            });
          }
        } else {
          let temp = {};
          temp.insptf = historyIdx.PTFID;
          temp.module = meplsIdx.MODULE;
          installedpe.push(temp);
        }
      });
    }
  });
  closedpe = _.uniq(closedpe);
  installedpe = _.uniq(installedpe);
  let installedpemap = _.groupBy(installedpe, 'insptf');
  callbackall(closedpe, installedpemap);
};

exports.getinstalledclosed = getinstalledclosed;
