/**
 * Monitors Ctrl+C and executes a callback instead of SIGINT.
 *
 * @param {Function} cb
 *     (optional) Callback function to execute on Ctrl+C.
 *     @default Function that prints a message and invokes process.exit
 */
export function monitorCtrlC(cb?: () => void): void;
