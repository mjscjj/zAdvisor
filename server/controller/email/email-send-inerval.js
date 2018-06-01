var https = require('https');
var sendEmail = require('../../controller/email/mail.js').sendMailByFileContent;
const app = require('../../server');
var email=app.models.emailtemp;
var getAPI = function () {
  email.find('',function (err,resu) {
    if(resu!=null&&resu.length>0){
      resu.forEach(function (ele) {
        console.log(ele)
        sendEmail(ele.toEmail,"test",'asd',ele.fileName,ele.fileContent,function (err,resuu) {
          if(err){
            console.log(err)
            return
          }
          console.log(resuu)
        })
        email.destroyById(ele.id,function (err) {
          if(err){
            console.log(er)
            return
          }
        })

      })

    }
  })
}

var startSendEmail=function () {
  setInterval(function (err,data) {
    console.log('.')
    getAPI()
  },1500)
}

// getAPI()
startSendEmail()
