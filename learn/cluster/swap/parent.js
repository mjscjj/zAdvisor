const child_process = require('child_process');

// parent.js
const p = child_process.spawn(
  'node', // 需要执行的命令
  ['child.js', 'a', 'b'], // 传递的参数
  {}
);
console.log('father-child pid:', p.pid);

p.on('exit', code => {
  console.log('exit:', code);
});

// 父进程的输入直接 pipe 给子进程（子进程可以通过 process.stdin 拿到）
process.stdin.pipe(p.stdin);

// 子进程的输出 pipe 给父进程的输出
p.stdout.pipe(process.stdout);
/* 或者通过监听 data 事件来获取结果
var all = '';
p.stdout.on('data', data => {
    all += data;
});
p.stdout.on('close', code => {
    console.log('close:', code);
    console.log('data:', all);
});
*/

// 子进程的错误输出 pipe 给父进程的错误输出
p.stderr.pipe(process.stderr);

/*{
    // 可以指定命令在哪个目录执行
    'cwd': null,
    // 传递环境变量，node 脚本可以通过 process.env 获取到
    'env': {},
    // 指定 stdout 输出的编码，默认用 utf8 编码为字符串（如果指定为 buffer，那 callback 的 stdout 参数将会是 Buffer）
    'encoding': 'utf8',
    // 指定执行命令的 shell，默认是 /bin/sh（unix） 或者 cmd.exe（windows）
    'shell': '',
    // kill 进程时发送的信号量
    'killSignal': 'SIGTERM',
    // 子进程超时未执行完，向其发送 killSignal 指定的值来 kill 掉进程
    'timeout': 0,
    // stdout、stderr 允许的最大输出大小（以 byte 为单位），如果超过了，子进程将被 kill 掉（发送 killSignal 值）
    'maxBuffer': 200 * 1024,
    // 指定用户 id
    'uid': 0,
    // 指定组 id
    'gid': 0
}*/

function  fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}
//console.log(fib(20))


// var compute =function (m){
//   // console.log('child get message'+m)
//   for(var m=0;m<100000000;m++){
//     for(var j=0;j<100000000;j++){
//
//       // process.stdout.write('.'+m)
//       if(j>100000000){
//         process.send(m);
//       }
//     }
//
//     // process.stdout.write('.'+m)
//   }
//
// }
//
// compute(30)
