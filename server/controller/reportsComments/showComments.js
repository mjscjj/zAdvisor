'use strict';

const db2 = require('../db2/db2pool');
let _ = require('lodash');
let pluck = require('lodash.pluck');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let dsConfig = require('../../datasources.json');
// let ibmdb = require('../db2/db2poolmpi');
let ddl = require('../../DDL');
let showComments = function(meplId, callback) {
  try {
    db2.pool.open(db2.cn, function(err, conn) {
    // ibmdb.pool.open(connectStr, function(err, conn) {
      if (err) {
        console.log(err);
      } else {
        let selectComment = ddl.selectComment;
        conn.query(selectComment, [meplId], function(err, commentitem) {
          if (err) console.log(err);
          else {
            conn.close();
            let result = [];
            _(commentitem).forEach(function(commentitemIdx) {
              if (commentitemIdx.ISDELETED === 0) {
                result.push(commentitemIdx);
              }
            });
            console.log(result);
            callback(null, result);
          }
        });
      }
    });
  } catch (err) {
    callback(err.message, null);
    console.log(err.message);
  }
};
// showComments('6900');
exports.showComments = showComments;
