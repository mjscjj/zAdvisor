// var sun=function (a,b) {
//   return a+b
// }
// console.log(sun(1,2))
//
// var out=function () {
//   return "ads"
// }
//
// console.log(out())
//
// function haveBreakfast(food, drink, callback) {
//   console.log('早餐' + food + ', ' + drink);
//   if (callback && typeof(callback) === "function") {
//     callback();
//   }
// }
//
// haveBreakfast('toast', 'coffee', function() {
//   console.log('早餐吃完了，工作了啦!');
// });

// var arr = new Array(6)
// arr[0] = "George"
// arr[1] = null
// arr[2] = null
// arr[3] = "James"
// arr[4] = "Adrew"
// arr[5] = "Martin"
//
// arr.splice(2,1)
//
// console.log(arr)
// for(let i in arr){
//   if(arr[i]==null){
//     arr.splice(i,1)
//   }
// }
//
// console.log(arr)

var x=1;
for(var  i=0;i<3;i++){
  x+=5*i
}
console.log(x)


// var smtpTransport = mailer.createTransport("SMTP", {
//   service: "Gmail",
//   auth: {
//     user: "gmail_id@gmail.com",
//     pass: "gmail_password"
//   }
// });
//
// var mail = {
//   from: "Yashwant Chavan <from@gmail.com>",
//   to: "to@gmail.com",
//   subject: "Send Email Using Node.js",
//   text: "Node.js New world for me",
//   html: "<b>Node.js New world for me</b>"
// }
//
// smtpTransport.sendMail(mail, function (error, response) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Message sent: " + response.message);
//   }
//
//   smtpTransport.close();
// });




