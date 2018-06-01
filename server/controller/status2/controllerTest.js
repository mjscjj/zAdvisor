const db2 = require('../db2/db2pool');
const getmepls = require('./getmepls').getmepls;
const getmeplitems = require('./getmeplitems').getmeplitems;
const getrelationsnoptf = require('./getrelations').getrelationsnoptfid;
const async = require('async');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/simple'; // # 数据库为 runoob


var hiperAparid = [];
getAllHiperAperid(function (aparids) {
  readaparsame(aparids,function (datas) {
    hiperAparid = datas;
    console.log(hiperAparid.length)

  })

})
// readaparsame(hiperAparid,function (data) {
//   hiperAparid=data;
// })



function getAllHiperAperid(callbackall) {
  db2.pool.open(db2.cn, function (err, conn) {
    conn.query('select aparid from apars_a where hiper=1 order by aparid asc', function (err, rows) {
      console.log(" hiper aparid length:" + rows.length);
      callbackall(rows);
      conn.close();
    })
  })
}

function getHiper_a(meplid, release, callbackall) {
  console.time("spend time:");
  getmeplitems(meplid, function (meplitems) {
    // meplitems = meplitems.slice(6, 20);
    console.log("mepl number:" + meplitems.length)
    getRelationByModule(meplitems, function (err, relations) {
      fs.writeFile('./relations.json', JSON.stringify(relations), function () {
      })

      getHiperRelations(meplitems, relations, function (hipers) {
        console.log(hipers)
        console.log("hipe  rrelations length:" + hipers.length)
        // readptfsame(hipers, function (data) {
        //   console.log('data length :' + data.length)
        // });
      })

      console.timeEnd("spend time:");
    })
  });
}

//  key.PTFID == null
function binarySearchChangenull(data, key, callbackall) {
  var h = data.length - 1,
    l = 0;
  while (l <= h) {
    var m = Math.floor((h + l) / 2);
    if (data[m].MODULE == key.MODULE) {
      // console.log(data[m])
      // console.log(key)
      let allhiperrelations = [];
      // let s1=1,s2=1,j=m,k=m;
      let s1 = 2, k = m, j = m;
      while (s1 == 2) {
        j++;
        // console.log(data[j])
        // console.log("j:"+j)
        if (data[j] != null && data[j].MODULE == key.MODULE) {
          allhiperrelations.push(data[j]);
        } else {
          j = k;
          s1 = 1;
        }
      }
      while (s1 == 1) {
        // console.log(data[j]);
        // console.log("j:"+j)
        if (data[j] != null && data[j].MODULE == key.MODULE) {
          allhiperrelations.push(data[j]);
        } else {
          s1 = 0;
        }
        j--;
      }
      // console.log("所有relation:"+allhiperrelations.length)
      callbackall(allhiperrelations)
      return;
    }
    if (key.MODULE > data[m].MODULE) {
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return false;
}

function getHiperRelations(meplitems, relations, callbackall) {
  let hipers=[];
  for (let i = 0, l = meplitems.length; i < l; i++) {
    binarySearchChangenull(relations, meplitems[i], function (hi) {
      console.log('module :')
      console.log(hi)
      console.log("meplites;-----");
      console.log(meplitems[i]);
      getmodulehiper(meplitems[i], hi, function (data) {
        if(data.length>0){
          console.log(data)
          hipers.push(data[0])
          console.log('\n\n\n\n\n\n==============\n=========   done!!!!!!!!!!!=========================================')
        }
      })
    })
    if (i == (l - 1)) {
      console.log(hipers.length)
      readptfsame(hipers,function (data) {
        fs.writeFile('./newhiper.json',JSON.stringify(data),function (err,data) {

        })
        let count=0;
        let fun=[];
        console.log(data.length)
           for(let n in data){
          for(let m in meplitems){
            if(data[n].PTFID==meplitems[m].PTFID){
              fun.push(data[n])
              console.log(count++)
            }
          }
           }
      })

    }
  }

}


function getmodulehiper(meplitem, relations, callbackahiper) {
  let ran = 0;
  let hipend = [];
  relations.sort(function (a, b) {
    return a.RANK - b.RANK;
  });

  if (meplitem.PTFID != null) {
    for (let i = 0, l = relations.length; i < l; i++) {
      if (meplitem.PTFID == relations[i].PTFID) {
        ran = relations[i].PTFID;
        break;
      }
    }
  } else {
    ran = 1000;
  }
  if(ran==0){
    console.log('#########################################################');
    console.log('#########################################################');
    console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');  console.log('#########################################################');
  }

  for (let i = 0, l = relations.length; i < l; i++) {
    if (relations[i].RANK > ran) {
      callbackahiper([])
      i=l;
      return;
    } else {
      hiperAparid.forEach(function (apar) {
        if (apar.APARID == relations[i].APARID) {
          hipend.push(relations[i]);
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
          console.log(hipend)
          return;
        }
      })
      if(hipend.length>0){
        callbackahiper(hipend)
        return
      }

    }
    if(i==(l-1)){
      console.log("for end:")
      callbackahiper([]);
      return;
    }
  }

}

/*
   ==========spent length 163709
                                 6164.057ms=======
 */
function getRelationByModule(meplitems, callbackall) {
  db2.pool.open(db2.cn, function (err, conn) {
    if (err) {
      console.log("conecton db err" + err);
      callbackall(err)
    }
    let sq = '';
    meplitems.forEach(function (eles) {
      sq += eles.MODULE + '\',\'';
    });
    sq += '';

    let sql = "select * from relations_a where release=? and   module in ('" + sq + "') order by module asc, rank asc  ";
    // console.log("sql:======:\n"+sql);
    conn.query(sql, [release], function (err, rows) {
      if (err) {
        console.log("=========select sql err===========\n" + err);
        return
      }
      console.log("allrelations length rows:" + rows.length)
      callbackall(null, rows);
      conn.close();
    })
  })
}

//==================================
// let meplid = '5888';
// let release = 'A'
//
// getHiper_a(meplid, release, function (err, data) {
//   if (err) {
//     console.log(err);
//     return
//   }
//   // console.log(data)
//   console.log(data.length)
// })


//===========================      lows         =============================
