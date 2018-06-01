'use strict';

// Include modules.
let xlsx = require('node-xlsx');
let fs = require('fs');
let _ = require('lodash');
let pluck = require('lodash.pluck');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let ibmdb = require('../db2/db2poolmpi');
let ddl = require('../../DDL');
const db2 = require('../db2/db2pool');

let data1 = [
  ['USERID', 'USERTIME', 'USERAREA', 'USERFUNCTION', 'LOCALTIME'],
];

// fs.writeFileSync('analysis.xlsx', buffer, {'flag': 'w'});

db2.pool.open(db2.cn, function(err, conn) {
  if (err) {
    console.log(err);
  } else {
    let selectAnalysisData = ddl.selectAnalysisData;
    conn.query(selectAnalysisData, function(err, data) {
      if (err) console.log(err);
      else {
        conn.close();
        _(data).forEach(function(dataIdx) {
          let array = [];
          array[0] = dataIdx.USERID;
          array[1] = dataIdx.USERTIME;
          array[2] = dataIdx.USERAREA;
          array[3] = dataIdx.USERFUNCTION;
          array[4] = dataIdx.LOCALTIME;
          data1.push(array);
        });
        let buffer = xlsx.build([
          {
            name: 'sheet1',
            data: data1,
          },
        ]);
        fs.writeFileSync('analysis.xlsx', buffer, {'flag': 'w'});
      }
    });
  }
});
