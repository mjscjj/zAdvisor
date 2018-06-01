'use strict'
module.exports = function(app) {
  var dashdbt=app.dataSources.db2_blue;
  var emailtemp=app.models.emailtemp;
  // dashdbt.automigrate('emailtemp',function (err) {
  //   if(err)console.log(err)
  // })

};
