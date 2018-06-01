const  fs = require('fs');
let cmd = 0;

function analyzemepl() {
  fs.readFile('./mepl.txt', 'utf8', function(err, data) {
    if (err) { console.log(err); return; }
    var str = data;
    var reg = /\*.*?\*\r/g;  //* \r\n
    var i = 0;
    let resu = [];
    while (res = reg.exec(str)) {
      console.log(res[0]);
      let ss = getmoudlestringasy(res[0]);
      if (ss != null) {
        resu.push(ss);
      }
      i++;
      if (i == 4835) {
        fs.writeFile('./mdptf.json', JSON.stringify(resu), function(err) {
          console.log(err);
        });
        console.log(resu);
        console.log(resu.length); console.log('cmd:' + cmd);
      }
    }
// 4834  ^.{3,20}$
  });
}

analyzemepl();
// getmoudlestringasy('*....DSNUEDMS06/22/161I38858 ....* ');
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
    let ftpaparreg=/^P/g
    if (modulereq.test(res1)||ftpaparreg.test(res2)) {
      console.log('-----------------------------------------  DSNU module  or ptfid is [stat with p] apar ------');
      return null;
    }

    let r = /^[A-Za-z]+/g;
    // let r = /.*/;
    // console.log(r.test(res2));
    if (r.test(res2)) {
      result.MODULE = res1;
      result.PTFID = res2;
      console.log(result);
      return result;
    } else {
      console.log('====== ptf null=====');
      result.MODULE = res1;
      result.PTFID = null;
      console.log(result);
      return result;
    }
  } else {
    console.log('==========  no suitable  ========');
    return null;
  }
}

// 1407  3142  4701
// 4701
