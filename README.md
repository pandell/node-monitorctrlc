# monitorctrlc

[![Build status](https://travis-ci.org/pandell/node-monitorctrlc.svg?branch=master)](https://travis-ci.org/pandell/node-monitorctrlc) [!["dependencies" status](https://david-dm.org/pandell/node-monitorctrlc.svg)](https://david-dm.org/pandell/node-monitorctrlc) [!["devDependencies" status](https://david-dm.org/pandell/node-monitorctrlc/dev-status.svg)](https://david-dm.org/pandell/node-monitorctrlc#info=devDependencies)

> Prevent SIGINT on Ctrl+C

[Git repository](https://github.com/pandell/node-monitorctrlc)

[Changelog](https://github.com/pandell/node-monitorctrlc/releases)

This function will prevent sending of `SIGINT` signal when `Ctrl+C` is pressed. Instead, the specified (or default) callback will be invoked.

Preventing `SIGINT` in projects that are (for example) using file system watchers on Windows will suppress the annoying `Terminate batch job (Y/N)?` prompt after `Ctrl+C`. This gives your watcher consistent behavior across all platforms.

## Install

```sh
$ npm install --save-dev monitorctrlc
# or yarn
$ yarn add --dev monitorctrlc
```


## Usage

```js
import { monitorCtrlC } from "monitorctrlc";
const monitor = monitorCtrlC();

// ... execute your program

monitor.dispose(); // detaches event handlers and pauses STDIN
```


## API

Assuming:

```js
import { monitorCtrlC, defaultCtrlCHandler } from "monitorctrlc";
```

### `monitorCtrlC([onCtrlC]): Disposable`

This function will prevent sending of `SIGINT` signal when `Ctrl+C` is pressed. Instead, the specified (or default) callback will be invoked.

NOTE: This should only be used by programs that do not normally read from STDIN, as this puts the stream into "raw" mode.

If your program has a normal termination path, you should invoke the `dispose` method on the object returned by `monitorCtrlC` to ensure the process can terminate normally. E.g.,

```js
const monitor = monitorCtrlC();

// ... processing

monitor.dispose(); // detaches event handlers and pauses STDIN
```

#### onCtrlC

_Type_: Function  
_Default_: default handler

optional function that will be called when `Ctrl+C` is pressed; if not specified, default handler that prints a message and exits the current process will be used.


### `defaultCtrlCHandler()`

The function that handles `Ctrl+C` by default (if no callback is specified for `monitorCtrlC`).


## Contributing

1. Clone git repository

2. `npm install` (will install dev dependencies needed by the next step)

3. `npm start` (will start a file system watcher that will re-lint JavaScript and JSON files + re-run all tests when change is detected)

4. Make changes, don't forget to add tests, submit a pull request.


## License

MIT © [Pandell Technology](http://pandell.com/)
