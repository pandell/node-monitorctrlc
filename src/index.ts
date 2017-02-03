import * as chalk from "chalk";
import * as tty from "tty";


/**
 * Prints a message indicating Ctrl+C was pressed then exits the process.
 */
export function defaultCtrlCHandler(): void {
    console.log(`'${chalk.cyan("^C")}', exiting`);
    process.exit();
}

/**
 * Monitors Ctrl+C and executes a callback instead of SIGINT.
 *
 * @param {Function} cb
 *     Callback function to execute on Ctrl+C.
 *     @default "defaultCtrlCHandler"
 */
export function monitorCtrlC(cb?: Function): void {
    const stdin = process.stdin as tty.ReadStream;
    if (stdin && stdin.isTTY) {
        const handler = (typeof cb === "function" ? cb : defaultCtrlCHandler);

        stdin.setRawMode(true);
        stdin.on("data", function monitorCtrlCOnData(data: Buffer): void {
            if (data.length === 1 && data[0] === 0x03) { // Ctrl+C
                return handler();
            }
        });
    }
}
