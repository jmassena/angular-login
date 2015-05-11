'use strict';

function create(fileName) {
  return new Logger(fileName);
}

function config(cfg) {
  Logger.logFlag = cfg.logFlag;
  Logger.logTypesAllowed = cfg.logTypesAllowed;
}

function Logger(fileName) {
  this.fileName = fileName;

  // console.log('Logger construction logFlag: ' + Logger.logFlag);
  // console.log('Logger construction logTypesAllowed: ' + Logger.logTypesAllowed);
}

Logger.prototype.promise = function (functionName, promise) {

  var that = this;
  return promise.then(function (data) {
      // console.log('successfully');

      that.success(functionName, 'success', data);
      return data;
    },
    function (err) {
      // console.log('UN-successfully');
      that.error(functionName, 'error', err);
      throw err;
    });
};

Logger.prototype.success = function (functionName, msg, data) {
  this.log('Success', this.fileName, functionName, msg, data);
};

Logger.prototype.info = function (functionName, msg, data) {
  this.log('Info', this.fileName, functionName, msg, data);
};

Logger.prototype.error = function (functionName, msg, err, data) {
  if (err.name) {
    msg += ': ' + err.name;
  }

  if (err.message) {
    msg += ': ' + err.message;
  }

  if (err.stack) {
    msg += ': ' + err.stack;
  }
  this.log('Error', this.fileName, functionName, msg, data);
};

Logger.prototype.log = function (type, fileName, functionName, msg, data) {

  // console.log('starting to log');
  if (!Logger.logFlag || Logger.logTypesAllowed.indexOf(type) === -1) {
    return;
    // console.log('exiting to log');

  }
  // console.log('continuing to log');

  if (msg == null) {
    msg = '';
  }

  if (data != null) {
    data = ': ' + JSON.stringify(data);
  } else {
    data = '';
  }

  console.log();
  console.log(type + ': ' + this.fileName + ': ' + functionName);
  console.log(msg, data);

};

Logger.logFlag = false;
Logger.logTypesAllowed = [];

module.exports = {
  create: create,
  config: config

};
