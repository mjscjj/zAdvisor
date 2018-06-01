// let arr = [1, 1, 2, 3, 4];
// let l = arr.length;
// // console.log(l)
//
// let tmp;
// for (let i in arr) {
//   console.log('---------------arr:' + i);
//   tmp = arr[i];
//
//   for (let j in arr) {
//     if (tmp == arr[j]) {
//       console.log(arr);
//       console.log(arr[j]);
//       console.log('bingo');
//       arr.splice(j, 1);
//       console.log(arr);
//     }
//   }
// }
// console.log(arr[2])
// console.log(arr)
// arr.splice(2,1)
// console.log(arr)


var arr = [1, 1, 1, 2, 3, 4, 5, 6];


var start = async function (arr) {
  let result = [];
  for (let i in arr) {
    console.log(i)
    if (arr[i] == null) {
    } else {
      let tmp = arr[i]
      await  new Promise(function (resolve, reject) {
        setTimeout(function () {
          let sign = 0;
          for (let j in arr) {
            if (tmp == arr[j]) {
              sign++
              arr[i]=null;
              console.log("same")
              console.log("in sign:" + sign)
            }
            if (j == (arr.length - 1)) {
              console.log("sign :" + sign)
              if (sign == 1) {
                result.push(tmp)
              }
              resolve()
            }
          }
          resolve()
        }, 2000)
      })
    }
    if (i == (arr.length - 1)) {
      console.log(result)
    }
  }
};

start(arr);


