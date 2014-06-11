# monitorctrlc [![Build Status](https://travis-ci.org/pandell/node-monitorctrlc.svg?branch=master)](https://travis-ci.org/pandell/node-monitorctrlc) [![devDependencies Status](https://david-dm.org/pandell/node-monitorctrlc/dev-status.svg)](https://david-dm.org/pandell/node-monitorctrlc#info=devDependencies)

> Prevent SIGINT on Ctrl+C

This function will prevent sending of `SIGINT` signal when `Ctrl+C` is pressed. Instead, the specified (or default) callback will be invoked.

Preventing `SIGINT` in projects that are (for example) using file system watchers on Windows will suppress the annoying `Terminate batch job (Y/N)?` prompt after `Ctrl+C`. This gives your watcher consistent behavior across all platforms.

## Install

```sh
$ npm install --save-dev monitorctrlc
```


## Usage

```js
var gulp = require('gulp');
var monitorCtrlC = require('monitorctrlc');

gulp.task('watch', function () {
    monitorCtrlC();
    gulp.watch('**', ['test']);
});
```


## API

Assuming:

```js
var monitorCtrlC = require('monitorctrlc');
```

### `monitorCtrlC([cb])`

This function will prevent sending of `SIGINT` signal when `Ctrl+C` is pressed. Instead, the specified (or default) callback will be invoked.

#### cb

_Type_: Function  
_Default_: default handler

optional function that will be called when `Ctrl+C` is pressed; if not specified, default handler that prints a message and exits the current process will be used.


### `monitorCtrlC.defaultCtrlCHandler()`

The function that handles `Ctrl+C` by default (if no callback is specified for `monitorCtrlC`). You can define a new default handler by assigning your custom function to this property:

```js
var monitorCtrlC = require('monitorctrlc');
monitorCtrlC.defaultCtrlCHandler = function customHandler() { ... };

monitorCtrlC(); // will use customHandler
```


## Contributing

1. Clone git repository

2. `npm install` (will install dev dependencies needed by the next step)

3. `npm start` (will start a file system watcher that will re-lint JavaScript and JSON files + re-run all tests when change is detected)

4. Make changes, don't forget to add tests, submit a pull request.


## License

MIT © [Pandell Technology](http://pandell.com/)
