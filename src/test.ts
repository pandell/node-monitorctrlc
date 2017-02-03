import * as assert from "assert";
import * as events from "events";
import * as tty from "tty";

import { monitorCtrlC } from "./index";

// We can't use mocha's "beforeEach" and "afterEach" because we're hijacking
// system behaviour and need to restore the original one as soon as possible
function hijackSystemCalls(cb: Function): () => any {
    return () => {
        const consoleBuffer: string[] = [];
        const emitter = new events.EventEmitter();
        const stdin = process.stdin as tty.ReadStream;

        let originalOn = stdin.on;
        stdin.on = emitter.on.bind(emitter);

        let originalEmit = process.stdin.emit;
        stdin.emit = emitter.emit.bind(emitter);

        let originalIsTTY = stdin.isTTY;
        stdin.isTTY = true;

        let originalSetRawMode = stdin.setRawMode;
        stdin.setRawMode = () => { consoleBuffer.push("setRawMode"); };

        let originalProcessExit = process.exit;
        process.exit = () => { consoleBuffer.push("exit"); };

        let originalConsoleLog = console.log;
        console.log = function (): void { consoleBuffer.push(Array.prototype.slice.call(arguments, 0).join(" ")); };

        try {
            return cb(consoleBuffer);
        } finally {
            console.log = originalConsoleLog;
            process.exit = originalProcessExit;
            stdin.setRawMode = originalSetRawMode;
            stdin.isTTY = originalIsTTY;
            stdin.emit = originalEmit;
            stdin.on = originalOn;
        }
    };
}


describe("monitorCtrlC()", () => {

    it("uses default handler", hijackSystemCalls((consoleBuffer: string[]) => {
        monitorCtrlC();
        process.stdin.emit("data", new Buffer("\u0003")); // fake ^C

        assert.strictEqual(3, consoleBuffer.length);
        assert.strictEqual("setRawMode", consoleBuffer[0]);
        assert(consoleBuffer[1].indexOf("exiting") > 0);
        assert.strictEqual("exit", consoleBuffer[2]);
    }));

    it("uses specified handler", hijackSystemCalls((consoleBuffer: string[]) => {
        monitorCtrlC(() => { consoleBuffer.push("custom"); });
        process.stdin.emit("data", new Buffer("\u0003")); // fake ^C

        assert.strictEqual(2, consoleBuffer.length);
        assert.strictEqual("setRawMode", consoleBuffer[0]);
        assert.strictEqual("custom", consoleBuffer[1]);
    }));

});
