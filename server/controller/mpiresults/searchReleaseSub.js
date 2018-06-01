'use strict';

const db2 = require('../db2/db2pool');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let dsConfig = require('../../datasources.json');
// let ibmdb = require('../db2/db2poolmpi');
let pearrayapar = require('./PE/getpearrayapar.js');
let ddl = require('../../DDL.js');
let _ = require('lodash');
let pluck = require('lodash.pluck');
let getReleaseSub = function(meplId, callback) {
  let selectReleaseSub = ddl.selectReleaseSub;
  try {
    db2.pool.open(db2.cn, function(err, conn) {
    // ibmdb.pool.open(connectStr, function(err, conn) {
      if (err) {
        console.log(err);
      } else {
        conn.query(selectReleaseSub, [meplId], function(err, meplRelease) {
          if (err) console.log(err);
          else {
            conn.close();
            console.log('done6');
            // console.log(meplRelease);
            callback(null, meplRelease);
          }
        });
      }
    });
  } catch (err) {
    callback(err.message, -1);
  }
};
// getReleaseSub('5825');
exports.getReleaseSub = getReleaseSub;
