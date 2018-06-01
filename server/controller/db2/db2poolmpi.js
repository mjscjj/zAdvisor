'use strict';
var Pool = require('ibm_db').Pool;
var pool = new Pool();
// console.log(__dirname)
var db2 = require(__dirname+'./../../datasourceslocal').db2_blue;
let cn = 'DATABASE=' + db2.database +
  ';HOSTNAME=' + db2.hostname +
  ';UID=' + db2.username +
  ';PWD=' + db2.password +
  ';PORT=' + db2.port +
  ';PROTOCOL=TCPIP';
pool.setMaxPoolSize(400);
function init() {
  console.log('init db2...');
  let ret = pool.init(20, cn);
  if (ret == true) {
    console.log('db2 pool init 50 connnections');
  } else {
    console.error('\n=====================   error!   ===================================\ndb2 connection faile,please check your db2 connection\n====================================================================\n');
    console.log(cn);
  }
}
exports.pool = pool;
exports.connectStr = cn;
