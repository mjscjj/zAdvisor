const db2 = require('../db2/db2pool');
const getmepls = require('./getmepls');
const getmeplitems = require('./getmeplitems').getmeplitems;
const getrelationsnoptf = require('./getrelations').getrelationsnoptfid;
const async = require('async');
var fs = require('fs')

function controlle(meplid, release, calllbackall) {
  let c=0;
  console.time("spend time:")

  getmeplitems(meplid, function (meplitems) {
    console.log("mepl number:"+meplitems.length)

    fs.writeFile('./meplitems.json', JSON.stringify(meplitems), function (err, data) {
    })
    // meplitems = meplitems.slice(1, 1000);
    let resuarr = [];
    async.mapLimit(meplitems, 20, function (it1, callback1) {
      getrelationsnoptf(it1.MODULE, it1.PTFID, release, function (relations) {
        if (relations != null) {
          process.stdout.write('.')
          resuarr.push(...relations)
          callback1();
        } else {
          callback1();
        }
      });
    }, function (err, relationsall) {
      if (err) {
        console.log(err);
        return
      }
      console.log()
      console.timeEnd("spend time:")

      calllbackall(resuarr)
    });
  });
}

function getHiper(meplid, release, callbackall) {

  controlle(meplid, release, function (data) {
    if (data == null || data.length == 0) {
      callbackall('No such data found')
    } else {
      console.log("same data length:"+data.length)

      readptfsame(data, function (data1) {
        callbackall(null, data1);
        fs.writeFile('.hiper.json',JSON.stringify(data1),function (err,data) {

        })
        console.log('hiper number:' + data1.length);

      })
    }
  })
  // fs.readFile('./sameptfresult.json', 'utf8', function (err, data) {
  //   if(err){
  //     console.log(err)
  //     callbackall(err)
  //   }else {
  //   }
  // })
}

//测试对外接口
// let meplid='5888';
// let release='A'
// getHiper(meplid,release,function (err,data) {
//   if(err){console.log(err);return}
//   console.log(data)
//   console.log(data.length)
// })

var readptfsame=function () {
  
}
//去掉重复ptf
// var readptfsame = async function (arr, callback) {
//   let res = [];
//   for (let i in arr) {
//     if (arr[i].sign == 1) {
//       // console.log(arr[i])
//     } else {
//       let tmp = arr[i].PTFID;
//       await  new Promise(function (resolve, reject) {
//         setTimeout(function () {
//           let sign = 0;
//           for (let j in arr) {
//             if (tmp == arr[j].PTFID) {
//               sign++
//               arr[j].sign = 1;
//             }
//             if (j == (arr.length - 1)) {
//               if (sign >= 1) {
//                 res.push(arr[i]);
//               }
//               resolve()
//             }
//           }
//         },)
//       })
//     }
//     if (i == (arr.length - 1)) {
//       callback(res);
//     }
//   }
// }

exports.controlle = controlle
exports.getHiper = getHiper;
