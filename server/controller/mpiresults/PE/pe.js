'use strict';

let _ = require('lodash');
let pluck = require('lodash.pluck');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let openPe = require('./getopenPePtfs.js');
let installedclosed = require('./getinstalledclosed.js');
/**
 * @ignore  =====================================================================================
 * @file for detecting pe in the client mepl
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
 * peresult: json of pe result
 *
 * @algorithm:
 * Gets the PEs for this mepl in the following way The algorithm uses three
 * sets and set operations to calculate the PEs.<br>
 * The algorithm is as follows
 * Create the following sets:
 *  o Set1 - Ptfs installed or subsumed on the system
 *  o Set2 - Open Ptfs in Error
 *  o Set3 - Closed Ptfs in Error
 * (Set1 INTERSECT Set2) UNION (Set1 INTERSECT Set3)
 * For each ptf level in the module it moves
 *  o UP the relations hierarchy to find closed Ptfs in Error
 *  o DOWN the hierarchy for installed Ptfs
 *
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let resultpe = function(release, subRelease, meplId, meplitem, relation, hist, installptfs, peArraySet, aparsSet, openPePtfs, callbackall) {
  installedclosed.getinstalledclosed(meplitem, relation, hist, installptfs, peArraySet, aparsSet, openPePtfs, function(closedpes, installed) {
    let openPes = _.flatten(openPePtfs);
    let installedmap = installed;
    let result = [];
    let openedtmp = [];
    // (Set1 INTERSECT Set2) UNION (Set1 INTERSECT Set3)
    _(openPes).forEach(function(openPesIdx) {
      if (installedmap[openPesIdx.PTFID] !== undefined) {
        // console.log('sos');
        let obj = {};
        obj.FirstModule = installedmap[openPesIdx.PTFID][0].module;
        obj.PtfPe = openPesIdx.PTFID;
        obj.AparFixesArray = openPesIdx.AparFix;
        obj.PtfFix = openPesIdx.PtfFix;
        obj.Summary = openPesIdx.Summary;
        obj.CloseDate = openPesIdx.CloseDate;
        obj.Severity = openPesIdx.Severity;
        openedtmp.push(obj);
      }
    });
    openedtmp = _.uniqBy(openedtmp, function(objopen) {
      return objopen.AparFixesArray;
    });
    // console.log(openedtmp);
    let closededtmp = [];
    _(closedpes).forEach(function(closedpesIdx) {
      if (installedmap[closedpesIdx.PTFID] !== undefined) {
        let obj = {};
        obj.FirstModule = installedmap[closedpesIdx.PTFID][0].module;
        obj.PtfPe = closedpesIdx.PTFID;
        obj.AparFixesArray = closedpesIdx.AparFix;
        obj.PtfFix = closedpesIdx.PtfFix;
        obj.Summary = closedpesIdx.Summary;
        obj.CloseDate = closedpesIdx.CloseDate;
        obj.Severity = closedpesIdx.Severity;
        closededtmp.push(obj);
      }
    });
    closededtmp = _.uniqBy(closededtmp, function(objclosed) {
      return objclosed.AparFixesArray;
    });
    result = _.unionWith(openedtmp, closededtmp, _.isEqual);
    let aparFix = _.uniq(pluck(result, 'AparFixesArray'));
    let mapaparfix = [];
    let resultall = [];
    _(aparFix).forEach(function(item) {
      mapaparfix[item] = 'UZ00000';
    });
    // UI is newer than UK, and if the alphabate is same the bigger the figure the newer the ptf
    _(result).forEach(function(item) {
      if (mapaparfix[item.AparFixesArray][1] > item.PtfPe[1]) {
        mapaparfix[item.AparFixesArray] = item.PtfPe;
      } else if (mapaparfix[item.AparFixesArray][1] === item.PtfPe[1]) {
        let aparfix = mapaparfix[item.AparFixesArray];
        let ptfpe = item.PtfPe;
        if (parseInt(aparfix.slice(2)) < parseInt(ptfpe.slice(2))) {
          mapaparfix[item.AparFixesArray] = item.PtfPe;
        }
      }
    });
    _(aparFix).forEach(function(aparFixIdx) {
      let item = {'AparFixesArray': aparFixIdx, 'PtfPe': mapaparfix[aparFixIdx]};
      let temp = _.find(result, item);
      resultall.push(temp);
    });
    callbackall(resultall);
    // callbackall(peresult);
  });
};

exports.resultpe = resultpe;
