var Pool = require('ibm_db').Pool;
var pool = new Pool();
var db2 = require(__dirname+'./../../datasources').mydashdb;
let cn = 'DATABASE=' + db2.database +
  ';HOSTNAME=' + db2.hostname +
  ';UID=' + db2.username +
  ';PWD=' + db2.password +
  ';PORT=' + db2.port +
  ';PROTOCOL=TCPIP';
pool.setMaxPoolSize(400);
var log = require('log4js').getLogger('server');

function test() {
  pool.open(cn,function (err,connection){
  if (err) {
    console.log(err);
    return;
  }
  let ail="cjjchu@cn.ibm.com"
  connection.query('select * from mepls_a' ,[ail], function(err1, data) {
    if (err1) {
      console.log(err1);
      return;
    }
    console.log(data);
    connection.close(function(err2) {
      if (err2) console.log(err2);
    });
  });
  })
}
test()


