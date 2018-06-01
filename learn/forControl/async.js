// var sleep = function (time) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(function () {
//       // 模拟出错了，返回 ‘error’
//       reject('error');
//     }, time);
//   })
// };
//
// var start = async function () {
//   try {
//     console.log('start');
//     await sleep(3000); // 这里得到了一个返回错误
//     // 所以以下代码不会被执行了
//     console.log('end');
//   } catch (err) {
//     console.log("err")
//     console.log(err); // 这里捕捉到错误 `error`
//   }
// };


let a = [1,2,3,4,5,6,7,8,9,10];

// // 错误示范
// 一到十.forEach(function (v) {
//   console.log(`当前是第${v}次等待..`);
//   await sleep(1000); // 错误!! await只能在async函数中运行
// });

// 正确示范
for(var v of a) {
  console.log(`当前是第${v}次等待..`);
  await sleep(1000); // 正确, for循环的上下文还在async函数中
}
