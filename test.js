/*jslint node: true, vars: true */
/*global describe: true, it: true */

"use strict";

var assert = require("assert");
var events = require("events");

var monitorCtrlC = require("./").monitorCtrlC;


// We can't use mocha's "beforeEach" and "afterEach" because we're hijacking
// system behaviour and need to restore the original one as soon as possible
function hijackSystemCalls(cb) {
    return function hijackSystemCallsRun() {
        var consoleBuffer = [];
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
            return cb(consoleBuffer);
        } finally {
            console.log = originalConsoleLog;
            process.exit = originalProcessExit;
            process.stdin.setRawMode = originalSetRawMode;
            process.stdin.isTTY = originalIsTTY;
            process.stdin.emit = originalEmit;
            process.stdin.on = originalOn;
        }
    };
}


describe("monitorCtrlC()", function () {

    it("uses default handler", hijackSystemCalls(function (consoleBuffer) {
        monitorCtrlC();
        process.stdin.emit("data", new Buffer("\u0003")); // fake ^C

        assert.strictEqual(3, consoleBuffer.length);
        assert.strictEqual("setRawMode", consoleBuffer[0]);
        assert(consoleBuffer[1].join(" ").indexOf("exiting") > 0);
        assert.strictEqual("exit", consoleBuffer[2]);
    }));

    it("uses specified handler", hijackSystemCalls(function (consoleBuffer) {
        monitorCtrlC(function () { consoleBuffer.push("custom"); });
        process.stdin.emit("data", new Buffer("\u0003")); // fake ^C

        assert.strictEqual(2, consoleBuffer.length);
        assert.strictEqual("setRawMode", consoleBuffer[0]);
        assert.strictEqual("custom", consoleBuffer[1]);
    }));

    it("uses redefined default handler", hijackSystemCalls(function (consoleBuffer) {
        var originalHandler = monitorCtrlC.defaultCtrlCHandler;
        try {
            monitorCtrlC.defaultCtrlCHandler = function () { consoleBuffer.push("custom"); };
            monitorCtrlC();
            process.stdin.emit("data", new Buffer("\u0003")); // fake ^C
        } finally {
            monitorCtrlC.defaultCtrlCHandler = originalHandler;
        }

        assert.strictEqual(2, consoleBuffer.length);
        assert.strictEqual("setRawMode", consoleBuffer[0]);
        assert.strictEqual("custom", consoleBuffer[1]);
    }));

    it("ignores invalid default handlers", hijackSystemCalls(function (consoleBuffer) {
        var originalHandler = monitorCtrlC.defaultCtrlCHandler;
        try {
            monitorCtrlC.defaultCtrlCHandler = 1;
            monitorCtrlC();
            process.stdin.emit("data", new Buffer("\u0003")); // fake ^C
        } finally {
            monitorCtrlC.defaultCtrlCHandler = originalHandler;
        }

        assert.strictEqual(3, consoleBuffer.length);
        assert.strictEqual("setRawMode", consoleBuffer[0]);
        assert(consoleBuffer[1].join(" ").indexOf("exiting") > 0);
        assert.strictEqual("exit", consoleBuffer[2]);
    }));

});
