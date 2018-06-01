'use strict';

const db2 = require('../../db2/db2pool');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
// let dsConfig = require('../../../datasources.json');
// let ibmdb = require('../../db2/db2poolmpi');
let ddl = require('../../../DDL.js');

/**
 * @ignore  =====================================================================================
 * @file for get aparptf and pearray
 * @input:
 * release, subRelease (eg: A.1, release is 'A', subRelease is '1')
 * @output:
 * aparptf, pearray
 * @author  luoxinyu@cn.ibm.com
 * @copyright Copyright IBM Corp. 2013,2017. All Rights Reserved.
 * @ignore  created in 2017-11-14
 * @ignore  =====================================================================================
 */
let getpearrayapar = function(release, subRelease, callback) {
  db2.pool.open(db2.cn, function(err, conn) {
  // ibmdb.pool.open(connectStr, function(err, conn) {
    if (err) {
      console.log(err);
      return;
    } else {
      let selectaparptfitem = ddl.selectaparptfitem;
      let selectPes = ddl.selectPes;
      conn.query(selectaparptfitem, function(err, aparptf) {
        if (err) {
          console.log(err);
          return;
        } else {
          ep.emit('aparptfitem', aparptf);
        }
      });
      conn.query(selectPes, [release, subRelease], function(err, pearray) {
        if (err) {
          console.log(err);
          return;
        } else {
          ep.emit('getpearray', pearray);
        }
      });
      ep.all('aparptfitem', 'getpearray', function(aparptf, pearray) {
        conn.close();
        // console.log(pearray);
        callback(aparptf, pearray);
      });
    }
  });
};
exports.getpearrayapar = getpearrayapar;
