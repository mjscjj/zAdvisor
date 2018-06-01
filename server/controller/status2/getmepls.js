const db2 = require('../db2/db2pool');


function getmepls(userid,  callback) {

  db2.pool.open(db2.cn, function (err, conn) {
    if (err) {
      console.log('========db2   connect  error========'+err);
      return
    }
    conn.query('select * from mepls_a where  userid=? ', [userid], function(err1, rows) {
      if (err1) {
        console.log(err1);
        return
      }
      if (rows != null) {
        callback(rows)
      } else {
        callback()
      }
    })

  })
}

exports.getmepls = getmepls

//=====test===========
// getmepls('AVMEV2672',function (data) {
//   console.log(data)
// })
