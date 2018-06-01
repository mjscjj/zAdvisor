const execFile = require('child_process').execFile;


// const child = execFile('node', ['--version'], (error, stdout, stderr) => {
//   if (error) {
//     throw error;
//   }
//   console.log(stdout);
// });

const exec=require('child_process').exec;
const  childexec=exec("dir",null,(err,stdout,stderr)=>{
  console.log(stdout)
})
