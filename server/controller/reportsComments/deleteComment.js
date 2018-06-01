'use strict';

let _ = require('lodash');
const db2 = require('../db2/db2pool');
let pluck = require('lodash.pluck');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let ibmdb = require('../db2/db2poolmpi');
let ddl = require('../../DDL');
let deleteComment = function(commentId, callback) {
  try {
    db2.pool.open(db2.cn, function(err, conn) {
      if (err) {
        console.log(err);
      } else {
        let deleteComment = ddl.deleteComment;
        conn.query(deleteComment, [commentId], function(err, commentitem) {
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
// deleteComment('1001');
exports.deleteComment = deleteComment;
