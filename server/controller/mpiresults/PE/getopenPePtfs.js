'use strict';

const db2 = require('../../db2/db2pool');
let _ = require('lodash');
let async = require('async');
// let dsConfig = require('../../../datasources.json');
// let ibmdb = require('../../db2/db2poolmpi.js');
let ddl = require('../../../DDL.js');
/**
 * @ignore  =====================================================================================
 * @file for get the opened pes(don't have ptf fix)
 * @input:
 * release, subRelease (eg: A.1, release is 'A', subRelease is '1')
 * @output:
 * openPePtfs: Array of opened pes
 *
 * @algorithm:
 * get the ptfs which close date is null in pe
 *
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let getopenPePtfs = function(release, subRelease, callback) {
  db2.pool.open(db2.cn, function(err, conn) {
  // ibmdb.pool.open(connectStr, function(err, conn) {
    if (err) {
      console.log(err);
      return;
    } else {
      let selectOpenPe = ddl.selectOpenPe;
      let selectPesopen = ddl.selectPesopen;
      conn.query(selectOpenPe, [release, subRelease], function(err, openPeApars) {
        if (err) {
          console.log(err);
          return;
        } else {
          async.map(openPeApars, function(item, callback) {
            conn.query(selectPesopen, [item.APARID, release, subRelease], function(err, peArray) {
              item.peArray = [...peArray];
              callback(null, item);
            });
          }, function(err, openApars) {
            let openPePtfs = [];
            _(openApars).forEach(function(openAparsIdx) {
              let peArray = openAparsIdx.peArray;
              _(peArray).forEach(function(peArrayIdx) {
                // console.log(peArrayIdx);
                let obj = {};
                obj.PTFID = peArrayIdx.PTFID;
                obj.PtfFix = 'STILL OPEN';
                obj.AparFix = openAparsIdx.APARID;
                obj.CloseDate = openAparsIdx.CLOSEDATE;
                obj.Severity = openAparsIdx.SEVERITY;
                obj.Summary = openAparsIdx.SUMMARY;
                obj.Rank = -2;
                openPePtfs.push(obj);
              });
            });
            callback(openPePtfs);
          });
        }
      });
    }
  });
};
exports.getopenPePtfs = getopenPePtfs;

