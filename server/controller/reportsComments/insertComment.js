'use strict';

const db2 = require('../db2/db2pool');
let _ = require('lodash');
let pluck = require('lodash.pluck');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let dsConfig = require('../../datasources.json');
// let ibmdb = require('../db2/db2poolmpi');
let ddl = require('../../DDL');
let insertComment = function(meplId, comment, callback) {
  try {
    db2.pool.open(db2.cn, function(err, conn) {
    // ibmdb.pool.open(connectStr, function(err, conn) {
      if (err) {
        console.log(err);
      } else {
        let insertComment = ddl.insertComment;
        conn.query(insertComment, [meplId, comment, 0], function(err, commentitem) {
          if (err) console.log(err);
          else {
            conn.close();

            callback(null, true);
            // console.log(commentitem);
          }
        });
      }
    });
  } catch (err) {
    callback(err.message, false);
    console.log(err.message);
  }
};
// insertComment('5825', 'test1');
exports.insertComment = insertComment;
