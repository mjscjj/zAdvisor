const db2 = require('../db2/db2pool');

function getmeplitems(meplid, callback) {
  db2.pool.open(db2.cn, function(err, conn) {
    if (err) {
      console.log(err);
      return;
    }
    conn.query('select * from meplitems_a where  meplid=? ', [meplid], function(err1, rows) {
      if (err1) {
        console.log(err1);
        return;
      }
      conn.close();
      if (rows != null) {
        callback(rows);
      } else {
        callback();
      }
    });
  });
}

exports.getmeplitems = getmeplitems;
// =====test===========
// getmeplitems('5815', function (data) {
//   console.log(data);
//   var fs=require('fs')
//   fs.writeFile('./meplitems.json',JSON.stringify(data),function (err,data) {
//   })
// });
