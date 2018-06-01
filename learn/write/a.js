const fs=require('fs');

fs.writeFile('./d.json','',function (err) {
  if(err)console.log(err)
})


function a() {
  for(let  i=0;i<10000;i+=2){
    setTimeout(function () {
      console.log(i)
      fs.appendFileSync('./d.json',i+' ')
    },10)
  }
}
function b() {
  for (let i=9999;i>0;i-=2){
  console.log(i)
    fs.appendFileSync('./d.json',i+" ")
}
}



// a()
// b()
