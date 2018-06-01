'use strict';

let _ = require('lodash');
let pluck = require('lodash.pluck');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let ibmdb = require('../db2/db2poolmpi');
let ddl = require('../../DDL');
const db2 = require('../db2/db2pool');

let analysisData = function(userId, userTime, userArea, userFunction, callback) {
  try {
    db2.pool.open(db2.cn, function(err, conn) {
      if (err) {
        console.log(err);
      } else {
        let insertAnalysisData = ddl.insertAnalysisData;
        let currentTime = new Date();
        conn.query(insertAnalysisData, [userId, userTime, userArea, userFunction, currentTime.toLocaleString()], function(err) {
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
// analysisData('386887912@qq.com', '20180120145317', 'Asia/Shanghai (current)', 'searchTapped');
exports.analysisData = analysisData;
