//'use strict';
const helper = {};
helper.formatError=require("./errorHelper").helper.formatError
exports.helper = helper;
const log4js = require('log4js');
const fs = require('fs');
const path=require('path')

const config = JSON.parse(fs.readFileSync(path.join(__dirname,'../config/log4js-config.json'), 'utf8'));

// check if logs directory exists
function checkAndCreateDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

if (config.customBaseDir) {
  checkAndCreateDir(config.customBaseDir);
}
if (!config.appenders) {
  throw new Error('log4js.json file Error');
}

log4js.configure(config);

const logInfo = log4js.getLogger('logInfo');
const logError = log4js.getLogger('logError');

helper.writeInfo = (msg) => {
  const message = msg || '';
  logInfo.info(message);
  // console.log(msg);
};

helper.writeErr = (msg, stack) => {
  var  message = msg || '';
  if (stack) {
    message += `\r\n${stack}`;
  }
  logError.error(message);
  // console.log(msg);
};

exports.use = function use(app) {
  const logAccess = log4js.getLogger('logAccess');
  const HTTP_LOG_FORMAT = ':remote-addr - ":method :url HTTP/:http-version" - ":referrer" ":user-agent" - :status :response-time ms';
  app.use(log4js.connectLogger(logAccess, {
    level: log4js.levels.INFO,
    format: HTTP_LOG_FORMAT,
  }));
};
