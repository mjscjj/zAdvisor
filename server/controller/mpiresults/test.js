// 'use strict';
//
// let EventProxy = require('eventproxy');
// let ep = new EventProxy();
// let dsConfig = require('../../datasources.json');
// let ibmdb = require('../db2/db2poolmpi');
// let pearrayapar = require('./PE/getpearrayapar.js');
// let ddl = require('../../DDL');
// let db2 = dsConfig.db23;
// let _ = require('lodash');
// let pluck = require('lodash.pluck');
// let connectStr = 'DATABASE=' + db2.database +
//   ';HOSTNAME=' + db2.hostname +
//   ';UID=' + db2.username +
//   ';PWD=' + db2.password +
//   ';PORT=' + db2.port +
//   ';PROTOCOL=TCPIP';
//
// ibmdb.pool.open(connectStr, function(err, conn) {
//   if (err) {
//     console.log(err);
//   } else {
//     let selectMeplitem = ddl.selectMeplitem;
//     conn.query(selectMeplitem, ['5825'], function(err, meplitem) {
//       if (err) console.log(err);
//       else {
//         conn.close();
//         console.log(meplitem);
//       }
//     });
//   }
// });
