const fs = require('fs');
//
// function ini() {
//   let data = fs.readFileSync('./meplitems.json');
//   let data2 = fs.readFileSync('./mdptf.json');
//   let no = JSON.parse(data2);
//   let java = JSON.parse(data);
//
//   java.forEach(function(element, index, arr) {
//     no.forEach(function(ele, ind, ar) {
//       if (element.sign == null) {
//         if (element.MODULE == ele.MODULE) {
//           element.sign = 1;
//         }
//       }
//     });
//   });
//
//   let coun = 0;
//   java.forEach(function(element, index, arr) {
//     if (element.sign == null) {
//       console.log(element);
//       console.log(coun++);
//     }
//   });
// }
//
// // ini()
//
// let data = fs.readFileSync('./meplitems.json');
// data = JSON.parse(data);
// console.log(data.length)
// let data2 = fs.readFileSync('./mdptf.json');
// data2=JSON.parse(data2)
// console.log(data2.length)
//
//
//
//
// function deleSame(ar) {
//   let resu = [];
//   ar.forEach(function(ele) {
//     if (ele.s == null) {
//       resu.push(ele);
//       ar.forEach(function(elem) {
//         if (ele.MODULE == elem.MODULE) {
//           elem.s = 1;
//         }
//       });
//     }
//   });
//   return resu;
// }
//
//
// let r=deleSame(data);
// console.log(r.length)
// let r2=deleSame(data2);
// console.log(r2.length)
//
//
// r.forEach(function(element, index, arr) {
//   if (element.sign == null) {
//     r2.forEach(function(ele, ind, ar) {
//       if (element.MODULE== ele.MODULE) {
//         element.sign=1;
//       }
//     });
//   }
// });
//
// let coun = 0;
// r.forEach(function(element) {
//   if (element.sign == null) {
//     console.log(element);
//     console.log(coun++);
//   }
// });
// console.log(r)

// let st = 'PI85715';
// let reg=/[\s\[\]]/g;
// // let reg = /[\s\[\],:\.\*"]/g;
// let res1 = st.replace(reg, '');
// console.log(res1)
// console.log(a > b);
// console.log(a < b);
//
// function binarySearch(arr, key, f, l) {
//   let mid = Math.floor((f + l) / 2);
//   // console.log('  middle:' + mid + '  a[mid]:' + arr[mid] + '  f:' + f + '  l:' + l + '  key:' + key);
//   // console.log(arr[mid] == k);
//   if(f<l) {
//     if (arr[mid] == key) {
//       return mid;
//     }
//     if (arr[mid] < key) {
//       return binarySearch(arr, key, mid + 1, l);
//     } else {
//       return binarySearch(arr, key, f, mid - 1)
//     }
//   }else {
//     return null;
//   }
// }
//
// let arr = [1, 2, 3, 4, 65];
// console.log(binarySearch(arr, 5, 0, arr.length - 1));
//
// function binarySearch(data, key, start, end) {
//   var end = end || data.length - 1,
//
//     start = start || 0,
//     m = Math.floor((start + end) / 2);
//   if (data[m] == key) {
//     return m;
//   }
//   if (key < data[m]) {
//     return binarySearch(data, key, 0, m - 1);
//   } else {
//     return binarySearch(data, key, m + 1, end);
//   }
//
//   return false;
// }
// var arr = [-34, 1, 3, 4, 5, 8, 34, 45, 65, 87];
// let r = binarySearch(arr, 4);
// console.log(r);

// function binarySearch(data, key){
//   var h = data.length - 1,
//     l = 0;
//   while(l <= h){
//     var m = Math.floor((h + l) / 2);
//     if(data[m] == key){
//       return m;
//     }
//     if(key > data[m]){
//       l = m + 1;
//     }else{
//       h = m - 1;
//     }
//   }
//   return false;
// }
var arr = [9, -34, 1, 3, 4, 5, 8, 34, 45, 65, 87];
//      let r=binarySearch(arr,4);
// console.log(r)
// function abc(callback) {
//   let i = 0;
//   let j = 0;
//   while (j < 3) {
//     while (true) {
//       console.log('i:' + i);
//       i++;
//       if (i === 3) {
//       break;
//         console.log('@@')
//
//       }
//     }
//     j++;
//     i = 0;
//     console.log('=====j:' + j);
//   }
// }
//
// abc(function(data) {
//   console.log('done');
// });
// function sortNumber(a,b)
// {
//   return a - b
// }
// arr.sort(sortBy('number',false))
// console.log(arr.sort(function (a,b) {
//   return a-b;
// }))

function abc(callback) {
  for (let i = 0; i < 10; i++) {
    console.log('i:'+i)
    for (let j = 0; j < 100; j++) {
      if (j == 98) {
        console.log(i + '-' + j);
        callback('123')
        return;
        console.log('test');
      }
    }

  }
}
// abc(function (data) {
//   console.log(data)
// });
