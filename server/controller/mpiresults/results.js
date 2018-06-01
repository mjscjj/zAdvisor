'use strict';

let _ = require('lodash');
let pluck = require('lodash.pluck');
let release = 'A';
let subRelease = 1;
let meplId = '5825';
let data = require('./getdata');
let pe = require('./PE/pe');
let inconsistent = require('./Inconsistence/Inconsistancies');
let misshiper = require('./missinghiper/missinghiper');
let percent = require('./percent/percentresult');
let report = require('./generateReport');
/**
 * @ignore  =====================================================================================
 * @file get missing hiper, pe, inconsistent
 * @input:
 * release, subRelease (eg: A.1, release is 'A', subRelease is '1'), meplId
 * @output:
 * hiper: missing hiper
 * peres: pe results
 * inconsistentres: inconsistent results
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let result = function(release, subRelease, meplId, callbackall) {
  try {
    data.getdata(release, subRelease, meplId, function(meplitem, relation, hist, installptfs, peArraySet, aparsSet, hitmodule, meplModel, openPePtfs) {
      // percent.getPercent(release, subRelease, meplId, meplitem, hist, aparsSet, function(percentres) {
      //   console.log(percentres);
      misshiper.getmishiper(meplitem, hist, aparsSet, function(hiper) {
        pe.resultpe(release, subRelease, meplId, meplitem, relation, hist, installptfs, peArraySet, aparsSet, openPePtfs, function(peres) {
          inconsistent.getInconsistancies(release, subRelease, meplId, meplitem, relation, hist, hitmodule, meplModel, function(inconsistentres) {
            // console.log(hiper);
            console.log(hiper.length);
            // console.log(inconsistentres);
            console.log(inconsistentres.length);
            // console.log(inconsistentres);
            // console.log(peres);
            console.log(peres.length);
            let mishiperresult = JSON.stringify(hiper);
            let inconsistentresult = JSON.stringify(inconsistentres);
            let peresult = JSON.stringify(peres);
            // console.log(mishiperresult);
            // console.log(inconsistentresult);
            // console.log(peresult);
            report.report(hiper, peres, inconsistentres, release, subRelease, meplId, function() {
              callbackall(null, hiper, peres, inconsistentres);
            });
          });
        });
      });
    });
    // });
  } catch (err) {
    callbackall(err.message, -1, -1, -1);
    console.log(err.message);
  }
};

// result(release, subRelease, meplId);
exports.result = result;
