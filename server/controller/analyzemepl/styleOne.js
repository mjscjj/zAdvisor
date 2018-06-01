const async = require('async');
const fs = require('fs');
let cmd = 0;


function getmoudlestringasy(str) {
  let regt = /\/[0-9]+\//;
  if (str.length === 35 && regt.test(str)) {
    let result = {};
    let arr = str.split('');
    let md = arr.slice(5, 13);
    let ptf = arr.slice(21, 28);

    // console.log('md:' + md + '\nptf:' + ptf + '\nstr:' + str);
    let reg = /[\s\[\],:\.\*"]/g;
    let res1 = JSON.stringify(md).replace(reg, '');
    let res2 = JSON.stringify(ptf).replace(reg, '');

    let modulereq = /^DSNU/g;
    let ftpaparreg = /^P/g;
    if (modulereq.test(res1) || ftpaparreg.test(res2)) {
      // console.log('-----------------------------------------  DSNU module  or ptfid is [stat with p] apar ------');
      // console.log(res1 + '---' + res2);
      return null;
    }

    let r = /^[A-Za-z]+/g;
    // let r = /.*/;
    // console.log(r.test(res2));
    if (r.test(res2)) {
      result.MODULE = res1;
      result.PTFID = res2;
      // console.log(result);
      return result;
    } else {
      // console.log('====== ptf null=====');
      result.MODULE = res1;
      result.PTFID = null;
      // console.log(result);
      return result;
    }
  } else {
    // console.log('..............  no suitable  ..............');
    // console.log(str);
    return null;
  }
}
/**
 * attention: begin whith "DSNU" is system module.
 * @param mepladdress :file address
 * @param callbackall
 */
function analyzemeplByFile(mepladdress, callbackall) {
  fs.readFile(mepladdress, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      callbackall('Read file error,can not find the file');
      return;
    }
    var str = data;
    var reg = /\*.*?\*\n/g;  //* \r\n
    let resu = [];
    let ress = str.match(reg);
    // console.log(ress);
    if (ress == null || ress.length < 1) {
      console.log('');
      callbackall('没有查询到符合的数据');
      return;
    }
    ress.forEach(function (ele) {
      let ss = getmoudlestringasy(ele);
      if (ss != null) {
        resu.push(ss);
      }
    });
    callbackall(null,resu)
  });
}

function analyzemeplByData(data, callbackall) {
    var str = data;
    var reg = /\*.*?\*\n/g;  //* \r\n
    let resu = [];
    let ress = str.match(reg);
    // console.log(ress);
    if (ress == null || ress.length < 1) {
      console.log('');
      callbackall('没有查询到符合的数据');
      return;
    }

    ress.forEach(function (ele) {
      let ss = getmoudlestringasy(ele);
      if (ss != null) {
        resu.push(ss);
      }
    });
    callbackall(null,resu)
}




exports.analyzemeplByFile=analyzemeplByFile;
exports.analyzemeplByData=analyzemeplByData;


function writeFileByName(filename,data,callbackall) {
  fs.writeFile(filename, JSON.stringify(data), function (err) {
    if (err) {
      console.log(err);
      callbackall('write file error');
      return;
    }
    callbackall(null, resu);
  });
}


//test
// let add = 'mepl.txt';
// analyzemeplByFile(add, function (err, data) {
//   if (err) {
//     console.log(err);
//     return
//   }
//   console.log(data)
//   console.log("end")
//   console.log(data.length);
//
// });

//
// fs.readFile('mepl.txt','utf8',function (err,data) {
//   analyzemeplByData(data,function (err,res) {
//     console.log(err)
//     console.log(res)
//   })
// })
