/*jslint node: true, vars: true */

"use strict";

var chalk = require("chalk");

var log;
try { log = require("gulp/node_modules/gulp-util").log; } catch (ignore) {}
if (!log) { log = console.log; }

function defaultCtrlCHandler() {
    log("'" + chalk.cyan('^C') + "'" + ', exiting');
    process.exit();
}

function monitorCtrlC(cb) {
    var stdin = process.stdin;
    if (stdin && stdin.isTTY) {
        if (typeof cb !== 'function') { cb = defaultCtrlCHandler; }
        stdin.setRawMode(true);
        stdin.on('data', function monitorCtrlCOnData(data) {
            if (data.length === 1 && data[0] === 0x03) { // Ctrl+C
                return cb();
            }
        });
    }
}

module.exports = monitorCtrlC;
module.exports.defaultCtrlCHandler = defaultCtrlCHandler;
