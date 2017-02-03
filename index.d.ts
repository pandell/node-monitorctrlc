/**
 * Prints a message indicating Ctrl+C was pressed then exits the process.
 */
export function defaultCtrlCHandler(): void;

/**
 * Monitors Ctrl+C and executes a callback instead of SIGINT.
 *
 * @param {Function} cb
 *     (optional) Callback function to execute on Ctrl+C.
 *     @default "defaultCtrlCHandler"
 */
export function monitorCtrlC(cb?: () => void): void;
