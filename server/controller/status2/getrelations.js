const db2 = require('../db2/db2pool');

function getrelationsnoptfid(module, ptfid, release, callback) {
  db2.pool.open(db2.cn, function (err, conn) {
    if (err) {
      console.log(err);
      return;
    }
    if (ptfid == null) {
      conn.query('select * from relations_a inner join apars_a on relations_a.aparid=apars_a.aparid where relations_a.module=? and relations_a.release=? and apars_a.hiper=1 order by rank DESC ', [module, release], function (err1, rows) {
        if (err1) {
          console.log(err);
          return;
        }
        conn.close()
        if (rows != null) {
          //   console.log(rows)
          callback(rows);
        } else {
          callback();
        }
      });
    } else {
      conn.query('select * from relations_a inner join apars_a on relations_a.aparid=apars_a.aparid where relations_a.module=? and relations_a.release=?  and relations_a.rank<(select rank from relations_a where module=? and release=? and ptfid=? FETCH FIRST 1 ROWS ONLY) and apars_a.hiper=1 order by rank DESC ', [module, release, module, release, ptfid], function (err1, rows) {
        if (err1) {
          console.log(err1);
          return;
        }
        conn.close()
        if (rows != null) {
          callback(rows);
        } else {
          callback();
        }
      });
    }
  });
}

exports.getrelationsnoptfid = getrelationsnoptfid;

// =====test===========

// {
//   "MEPLID": 5815,
//   "LDMOD": "DSN3RRSA",
//   "MODULE": "DSN3CMT1",
//   "PTFID": "UK58304",
//   "UNOFFPTF": null
// }
// getrelationsnoptfid('DSN3CMT1','UK58304','A' ,function(data) {
//   console.log(data);
// });
