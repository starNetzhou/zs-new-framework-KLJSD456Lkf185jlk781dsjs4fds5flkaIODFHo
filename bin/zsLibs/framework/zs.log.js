window.zs = window.zs || {};
window.zs.log = window.zs.log || {};
(function (exports) {
    'use strict';

    let Level;
    (function (Level) {
        Level[Level["DEBUG"] = 0] = "DEBUG";
        Level[Level["INFO"] = 1] = "INFO";
        Level[Level["WARN"] = 2] = "WARN";
        Level[Level["ERROR"] = 3] = "ERROR";
        Level[Level["FATAL"] = 4] = "FATAL";
    })(Level = Level || (Level = {}));

    class Configs { }
    Configs.logLevel = Level.INFO;
    Configs.logTime = true;
    Configs.logMilliseconds = false;
    Configs.fatalThrow = false;
    Configs.color_Debug = '#08f';
    Configs.color_Info = '#000';
    Configs.color_Warn = '#f80';
    Configs.color_Error = '#f00';
    Configs.color_Fatal = '#900';

    function log(msg, category, level, data) {
        let output = '';
        if (level == null) {
            level = Level.INFO;
        }
        if (Configs.logLevel > level) {
            return;
        }
        let logColor = '#000';
        switch (level) {
            case Level.DEBUG:
                output = '[DEBUG] ';
                logColor = Configs.color_Debug;
                break;
            case Level.INFO:
                output = '[INFO] ';
                logColor = Configs.color_Info;
                break;
            case Level.WARN:
                output = '[WARN] ';
                logColor = Configs.color_Warn;
                break;
            case Level.ERROR:
                output = '[ERROR] ';
                logColor = Configs.color_Error;
                break;
            case Level.FATAL:
                output = '[FATAL] ';
                logColor = Configs.color_Fatal;
                break;
        }
        if (category && category.length > 0) {
            output += '<' + category + '> ';
        }
        output += msg;
        if (Configs.logTime) {
            let date = new Date();
            let time = '    ' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            if (Configs.logMilliseconds) {
                time = time + ':' + date.getMilliseconds();
            }
            output += time;
        }
        if (data) {
            console.log('%c ' + output, 'color:' + logColor, data);
        } else {
            console.log('%c ' + output, 'color:' + logColor);
        }
        if (level == Level.FATAL && Configs.fatalThrow) {
            throw new Error(output);
        }
    }
    function debug(msg, category, data) { log(msg, category, Level.DEBUG, data); }
    function info(msg, category, data) { log(msg, category, Level.INFO, data); }
    function warn(msg, category, data) { log(msg, category, Level.WARN, data); }
    function error(msg, category, data) { log(msg, category, Level.ERROR, data); }
    function fatal(msg, category, data) { log(msg, category, Level.FATAL, data); }

    exports.Level = Level;
    exports.Configs = Configs;
    exports.log = log;
    exports.debug = debug;
    exports.info = info;
    exports.warn = warn;
    exports.error = error;
    exports.fatal = fatal;

})(window.zs.log = window.zs.log || {});