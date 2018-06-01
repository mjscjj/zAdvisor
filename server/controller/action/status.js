'use strict';
var mepl = require('../status2/getmepls');
const  gethiper = require('../status2/controller').getHiper;
var get = function(req, res, next) {
  mepl.getmepls(req.body.userid, function(me) {
    console.log(req.session)
    console.log(req.cookies)
    console.log(req.cookie)
    console.log(req.session.user.id);
    if (me == undefined || me[0] == undefined || me[0] == null) {
      return res.end('没有查询到此ID的mepl信息');
    } else {
      res.render('status_.ejs', {'mepl': me, 'message': 'success'});
    }
  });
};
var getmeplresult = function(req, res) {
  console.log('===========get hiper start!============');
  console.log(req.query.meplid + req.query.release);
  gethiper(req.query.meplid, req.query.release, function(err, data) {
    if (err) { console.log(err); return data; }
    res.render('status_result.ejs', {'hiper': data, 'message': `ALL MISSING HIPER NUMBER:${data.length}`});
  });
};

exports.get = get;
exports.getmeplresult = getmeplresult;
