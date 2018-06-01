var Client = require('ftp');
let async = require('async');
var fs = require('fs');
var analyzemeplByFile = require('../analyzemepl/styleOne').analyzemeplByFile;
const db2 = require('../db2/db2pool');
const zconfig = require('../../config/zConfig').zconfig;
const logger = require('../../utils/logHelper').helper;

/**
 *
 * @param filename
 * @param callbackall
 */
function downloadFileFromFTP(filename, saveName, server, callbackall) {
  server.get(filename, function(err, stream) {
    if (err) {
      console.error(err);
      logger.writeErr(JSON.stringify(err),err.stack)
      callbackall('pmr FTP err:' + err);
      return;
    }
    stream.once('close', function() {
      callbackall(null, saveName);
    });
    stream.pipe(fs.createWriteStream('./server/controller/pmrData/data/' + saveName));
  });
}

/**
 *
 * @param pmrName  exp:90015,124,672
 * @param callbackall function (err,files)
 * @return a meplfile array
 */
function getMeplNameFromPmr(pmrName, callbackall) {
  let c = new Client();
  let fileNames = [];
  if (pmrName.length != 13) {
    callbackall('Illegal pmrid!');
    return;
  }
  c.connect({
    host: zconfig.pmrServer.host, user: zconfig.pmrServer.user, password: zconfig.pmrServer.password,
    secure: true,
    secureOptions: {rejectUnauthorized: false},
  });
  c.on('ready', function() {
    console.log('ftp server connect cuccess');
    paths = '../../../../../../../../../ecurep/pmr' + '/' + pmrName[0] + '/' + pmrName[1] + '/' + pmrName + '/' + '0-all_data/';
    console.log('path:' + paths);
    c.cwd(paths, function(err, res) {
      if (err) {
        console.error(err);
        logger.writeErr(JSON.stringify(err),err.stack)
        callbackall('No information was found on the pmrid:' + pmrName);
        c.end();
        return;
      }
      c.list(function(err, list) {
        if (err) {
          console.error(err);
          callbackall(err);
          c.end();
          return;
        }
        list.forEach(function(eles) {
          if (eles.type === '-') {
            let modulereq = /\.MEPL/g;
            let modulereq2 = /\.mepl/g;
            if (modulereq.test(eles.name) || modulereq2.test(eles.name)) {
              fileNames.push({
                'name': eles.name,
                'data': eles.date,
                'path_name': paths + eles.name,
              });
            }
          }
        });
        if (fileNames == null||fileNames.length<1) {
          callbackall('No mepl file in FTP server');
          c.end();
        } else {
          callbackall(null, fileNames);
          c.end();
        }
      });
    });
  });
  c.on('error',function (err) {
    console.log("ftp login error:"+JSON.stringify(err))
    logger.writeErr(JSON.stringify(err),err.stack)
    callbackall(err)
    return;
  })
  c.on('end', function() {
    console.log('ftp connection close');
  });
}

/**
 *
 * @param files:a array of file infomation exp:
 * {
 * name: '90015.124.672.PROXY.PS0A.D171218.MEPL',
    data: 2017-12-18T01:24:00.000Z,
    path_name: '../../../../../../../../../ecurep/pmr/9/0/90015,124,672/0-all_data/90015.124.672.PROXY.PS0A.D171218.MEPL'
    }
 * @param callbackall function (err:err,meplID:meplids )
 * @constructor
 */
function DownMeplUpdataDb(files, callbackall) {
  let c = new Client();
  c.connect({
    host: zconfig.pmrServer.host, user: zconfig.pmrServer.user, password: zconfig.pmrServer.password,
    secure: true,
    secureOptions: {rejectUnauthorized: false},
  });
  c.on('ready', function() {
    console.log('ftp2 connection success');
    downloadFileFromFTP(files.path_name, files.name, c, function(err, fname) {
      if(err){
        logger.writeErr(JSON.stringify(err),err.stack)
        callbackall("No this mepl file in FTP server")
        return
      }
      db2.pool.open(db2.cn, function(err, conn) {
        if (err) {
          callbackall('db2 error:can not connect to database.')
          console.log('========db2   connect  error========' + err);

          return;
        }
        console.log('db2 open success');
        analyzemeplByFile("./server/controller/pmrData/data/"+fname, function(err, data) {
          if(err){
            callbackall('This is not a typical mepl file')
            return
          }
          if(data.length<1){
            callbackall('This is not a typical mepl file')
            return
          }
          // console.log(data);
          conn.query('select max(meplid) as MX from meplitems_a', function(err, id) {
            if (id == null || id[0] == null) {
              id[0] = 1;
            }
            let meplidinit = id[0].MX + Math.ceil(Math.random() * 5);
            let sql = joinString(data, meplidinit);
            conn.query(sql, function(err, data) {
              if (err) {
                logger.writeErr(JSON.stringify(err),err.stack)
                console.error("db2 insert:"+JSON.stringify(err));
                return;
              }
              console.log('=================  insert success  ===================');
              meplres={}
              meplres.meplid=meplidinit;
              logger.writeInfo("insert success"+meplres+"\nsql:"+sql)
              callbackall(null, meplres);
              c.end();
              conn.close();
            });
          });
        });
      });
    });
  });
  c.on('error',function (err) {
    logger.writeErr(JSON.stringify(err),err.stack)
    console.log("ftp login error"+JSON.stringify(err))
    callbackall(err)
  })
  c.on('end', function() {
    console.log('ftp2 connection close');
  });
}

function joinString(mp, meplid) {
  let res = 'insert into meplitems_a (meplid,ldmod,module,ptfid) values ';
  mp.forEach(function(ele) {
    if (ele.PTFID == null) {
      res += '(' + meplid + ',\'' + '0' + '\',\'' + ele.MODULE + '\',\'' + '\'),';
    } else {
      res += '(' + meplid + ',\'' + '0' + '\',\'' + ele.MODULE + '\',\'' + ele.PTFID + '\'),';
    }
  });
  return res.slice(0, res.length - 1);
}

// getMeplNameFromPmr('93926,695,760', function(err, res) {
//   if (err) {
//     console.error('file err:' + err);
//     return;
//   }
//   console.log(res);
//   // DownMeplUpdataDb(res[0], function (err, data) {
//   //   if (err) {
//   //     console.log(err);
//   //     return;
//   //   }
//   //   console.log(data);
//   // });
// });
//                   90015,124,672  90014,124,672
//90030,004,000
//90030,004,000
exports.getMeplNameFromPmr = getMeplNameFromPmr;
exports.DownMeplUpdataDb = DownMeplUpdataDb;
