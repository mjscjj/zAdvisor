// var util=require('util')
// var str = '*....DSNXVCAR12/23/1200.50   ....*';
//
// var arr = str.split('');
//
// arr1=arr.splice(5,8);
// console.log("arr splice:"+arr1)
// var s=JSON.stringify(arr1)
// console.log("s:"+s)
//
// var reg = /\[/;
// var res = s.replace(s, '');
// console.log("s result :"+res);//
//
//
//
// var str = JSON.stringify(arr);// 这样也能转化为字符串但现在还是数组的形式不过类型已经是字符串了；
//
// var arr2 = JSON.parse(str);// 这样就是把字符串解析 其实就是把外面的中括号去掉；
//
// console.log(arr2);

function getmoudlestringasy(str) {
  str = '*..5.DSNURTHV05/13/13UK94247 .... *';
  let regt = /\/[0-9]+\//;
  // console.log(str.length);
  // console.log(regt.test(str));
  if (str.length === 35 && regt.test(str)) {
    let arr = str.split('');
    let md = arr.slice(5, 13);
    let ptf = arr.slice(21, 28);
    let result = {};
    // console.log('md:' + md + '\nptf:' + ptf + '\nstr:' + str);
    let reg = /[\[\],:\.\*"]/g;
    let res1 = JSON.stringify(md).replace(reg, '');
    let res2 = JSON.stringify(ptf).replace(reg, '');

    let modulereq = /^DSNU/g;
    var s = modulereq.test(res1);
    console.log(s);
    if (s) {
      console.log('-----------------------------------------====  module not suitable  =====');
    } else {

    }
    // let r = /^[A-Za-z]+/g;
    let r = /.*/;
    // console.log(r.test(res2));
    if (r.test(res2)) {
      result.MODULE = res1;
      result.PTFID = res2;
      console.log(result);
      return result;
    } else {
      console.log('\n\n====== ptf not suitable=====');
      return null;
    }
  } else {
    console.log('==========  no suitable  ========');
    return null;
  }
}

getmoudlestringasy();


var s="20B902E0 C2C5D7D3 0016D4C5 D7D360D3  C9D2C540 C6D6D940 E4E340C6 C5C1E340    *....BEPL..MEPL-LIKE FOR UT FEAT *\n" +
  "     0020 000264E0 C4E2D5E4 C6C3D4C1 F1F161F0  F461F1F3 E4C9F1F2 F1F5F740 00000000    *....DSNUFCMA11/04/13UI12157 ....*\n" +
  "     0040 00027230 C4E2D5E4 C6C6D4C2 F0F361F0  F561F1F3 E4D2F9F2 F2F0F640 00000000    *....DSNUFFMB03/05/13UK92206 ....*\n" +
  "     0060 00027978 C4E2D5E4 C6C6D4C3 F1F161F1  F961F1F4 E4C9F2F3 F2F1F640 00000000    *....DSNUFFMC11/19/14UI23216 ....*\n" +
  "     0080 000282B8 C4E2D5E4 C6C3D4C4 F0F861F1  F161F1F5 E4C9F3F0 F1F1F540 00000000    *....DSNUFCMD08/11/15UI30115 ....*\n" +
  "     00A0 000289A0 C4E2D5E4 C6C3D4C5 F1F261F2  F261F1F2 F2F34BF1 F8404040 00000000    *....DSNUFCME12/22/1223.18   ....*\n" +
  "     00C0 0002A450 C4E2D5E4 C6C6D4C6 F0F561F1  F661F1F7 E4C9F4F7 F2F8F540 00000000    *...&DSNUFFMF05/16/17UI47285 ....*\n" +
  "     00E0 0002A82C C4E2D5E4 C6C6D4C7 F1F261F2  F261F1F2 F2F34BF1 F9404040 00000000    *....DSNUFFMG12/22/1223.19   ....*\n" +
  "     0100 0002B044 C4E2D5E4 C6C6D4C8 F0F661F0  F761F1F6 E4C9F3F8 F4F7F040 00000000    *....DSNUFFMH06/07/16UI38470 ....*\n" +
  "     0120 0002B4A4 C4E2D5E4 C6C3D4C9 F1F261F2  F261F1F2 F2F34BF1 F8404040 00000000    *....DSNUFCMI12/22/1223.18   ....*\n" +
  "     0140 0002B6F8 C4E2D5E4 C6C3D4D1 F1F261F2  F261F1F2 F2F34BF1 F8404040 00000000    *...8DSNUFCMJ12/22/1223.18   ....*\n" +
  "     0160 0002C350 ";
