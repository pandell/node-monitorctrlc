/*jslint node: true, vars: true */
/*global describe: true, it: true */

"use strict";

var assert = require("assert");
var events = require("events");

var monitorCtrlC = require("./");


// We can't use mocha's "beforeEach" and "afterEach" because we're hijacking
// system behaviour and need to restore the original one as soon as possible
function hijackSystemCalls(consoleBuffer, cb) {
    var emitter = new events.EventEmitter();

    var originalOn = process.stdin.on;
    process.stdin.on = emitter.on.bind(emitter);

    var originalEmit = process.stdin.emit;
    process.stdin.emit = emitter.emit.bind(emitter);

    var originalIsTTY = process.stdin.isTTY;
    process.stdin.isTTY = true;

    var originalSetRawMode = process.stdin.setRawMode;
    process.stdin.setRawMode = function () { consoleBuffer.push("setRawMode"); };

    var originalProcessExit = process.exit;
    process.exit = function () { consoleBuffer.push("exit"); };

    var originalConsoleLog = console.log;
    console.log = function () { consoleBuffer.push(Array.prototype.slice.call(arguments, 0)); };

    try {
        cb();
    } finally {
        console.log = originalConsoleLog;
        process.exit = originalProcessExit;
        process.stdin.setRawMode = originalSetRawMode;
        process.stdin.isTTY = originalIsTTY;
        process.stdin.emit = originalEmit;
        process.stdin.on = originalOn;
    }
}


describe("monitorCtrlC()", function () {

    it("should use default handler", function () {
        var consoleBuffer = [];
        hijackSystemCalls(consoleBuffer, function () {
            monitorCtrlC();
            process.stdin.emit("data", new Buffer("\u0003")); // fake ^C

            assert.strictEqual(3, consoleBuffer.length);
            assert.strictEqual("setRawMode", consoleBuffer[0]);
            assert(consoleBuffer[1].join(" ").indexOf("exiting") > 0);
            assert.strictEqual("exit", consoleBuffer[2]);
        });
    });

    it("should use specified handler", function () {
        var consoleBuffer = [];
        hijackSystemCalls(consoleBuffer, function () {
            monitorCtrlC(function () { consoleBuffer.push("custom"); });
            process.stdin.emit("data", new Buffer("\u0003")); // fake ^C

            assert.strictEqual(2, consoleBuffer.length);
            assert.strictEqual("setRawMode", consoleBuffer[0]);
            assert.strictEqual("custom", consoleBuffer[1]);
        });
    });

});
