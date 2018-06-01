const http = require('http');

const hostname = '9.125.65.36';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log('request comming!');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  process.stdout.write('this is  child process');

  console.log(`服务器运行在 http://${hostname}:${port}/`);
});
