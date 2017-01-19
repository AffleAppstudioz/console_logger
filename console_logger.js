/**
 * Created by Ritesh Arora on 13/10/16.
 */

var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);


Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();
  return [this.getFullYear(), mm, dd].join('-');
};

/**
 * Get Line No and Filename from Stack's 
 */
Object.defineProperty(global, '__stack', {
  get: function() {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
      return stack;
    };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function() {
    return __stack[2].getLineNumber();
  }
});
Object.defineProperty(global, '__file', {
  get: function() {
    return __stack[2].getFileName().split('/').slice(-1)[0];
  }
});

/**
 * For handling circular json
 */
var JsonToString = function(data) {
  try {
    return JSON.stringify(data)
  } catch (e) {
    return "Invalid Object as its circular";
  }
}


// Json for sharing data 
var infoJson = {};

//Json To contains internal functions that no need to export
var LoggingJson = {
  /**
   * Write Data in File
   */
  writeFile: function(message, module, path) {
    if (!message) {
      message = "";
    }
    var line = infoJson.lineno ? infoJson.lineno : __line;
    var file = infoJson.filename ? infoJson.filename : __file;

    delete infoJson.lineno;
    delete infoJson.filename;

    var date = new Date();

    //convert path to required path
    var path = path.trim();

    if (path.indexOf("/") == 0) {
      path = path.substr(1)
    }
    if (path.lastIndexOf("/") + 1 == path.length) {
      path = path.substr(0, path.length - 1);
    }

    var filepath = "/" + path + '/' + date.yyyymmdd() + '.log';
    path = path.replace(/[^a-zA-Z0-9/]/g, '_');

    this.dirExist(appDir, path, function(err, result) {
      if (err) { console.info(err); }
      fs.exists(filepath, function(exists) {
        message = 'From:' + module + ' | Time : ' + new Date().getHours() + ':' + new Date().getMinutes() + ":" + new Date().getSeconds() + ' | file =>' + file + ' | line =>' + line + ' | msg => ' + message;
        fs.appendFile(appDir + filepath, message + '\n', { flags: 'a+' }, function(err) {
          if (err) {
            // console.info("rrrrrrrrrrrrr",err);
          }
        });
      });
    })
  },

  /**
   * Check if log directory exist otherwise create one
   */
  dirExist: function(basepath, path, cb) {
    var that = this;
    var folders = path.split("/");
    if (folders[0] == "") {
      return cb(null, true);
    }
    fs.stat(basepath + '/' + folders[0], function(err, stats) {
      if (err) {
        fs.mkdir(basepath + '/' + folders[0], function(error) {
          if (error) {
            return cb(err)
          };
          basepath = basepath + '/' + folders[0];
          folders.shift();
          folders = folders.join("/");
          that.dirExist(basepath, folders, cb);
        });
      } else {
        return cb(null, true);
      }

    });

  }
};

module.exports = function(setconsole) {
  if (!setconsole) {
    setconsole = {};
  }
  /**
   * Override console.log
   */
  console.log = function() {
      infoJson["lineno"] = __line;
      infoJson["filename"] = __file;

      var string = "";

      arguments[0] ? typeof arguments[0] == 'object' ? string += " -> " + JsonToString(arguments[0]) : string += " -> " + arguments[0] : null;
      arguments[1] ? typeof arguments[1] == 'object' ? string += " -> " + JsonToString(arguments[1]) : string += " -> " + arguments[1] : null;
      if (typeof setconsole.showinterminal == 'undefined' || setconsole.showinterminal) {
        console.info(string);
      }
      if (typeof setconsole.console == 'undefined' || setconsole.console) {
        LoggingJson.writeFile(string, "Console", setconsole.path ? setconsole.path : "/log");
      }
    },
    /**
     * Override console.error
     */
    console.error = function() {
      infoJson["lineno"] = __line;
      infoJson["filename"] = __file;

      var string = "";

      arguments[0] ? typeof arguments[0] == 'object' ? string += " -> " + JsonToString(arguments[0]) : string += " -> " + arguments[0] : null;
      arguments[1] ? typeof arguments[1] == 'object' ? string += " -> " + JsonToString(arguments[1]) : string += " -> " + arguments[1] : null;
      if (typeof setconsole.showinterminal == 'undefined' || setconsole.showinterminal) {
        console.info(string);
      }
      if (typeof setconsole.console == 'undefined' || setconsole.console) {
        LoggingJson.writeFile(string, "Console", setconsole.path ? setconsole.path : "/log");
      }


    }
    /**
     * Log Function for writing in file
     */
  Log = function() {
    infoJson["lineno"] = __line;
    infoJson["filename"] = __file;

    var string = "";
    arguments[0] ? typeof arguments[0] == 'object' ? string += " -> " + JsonToString(arguments[0]) : string += " -> " + arguments[0] : null;
    arguments[1] ? typeof arguments[1] == 'object' ? string += " -> " + JSON.stringify(arguments[1]) : string += " -> " + arguments[1] : null;
    if (typeof setconsole.showinterminal == 'undefined' || setconsole.showinterminal) {
      console.info(string);
    }
    if (typeof setconsole.log == 'undefined' || setconsole.log) {
      LoggingJson.writeFile(string, "Log", setconsole.path ? setconsole.path : "/log");
    }
  }
}
