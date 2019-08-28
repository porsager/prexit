[![version](https://img.shields.io/npm/v/prexit.svg)]() [![license](https://img.shields.io/github/license/porsager/prexit.svg)]()

# 🚪 Prexit 

A graceful way to shutdown / handle **PR**ocess **EXIT** - way better than other \*rexits

```js
const prexit = require('prexit')

prexit((signal, code_or_err) => {
  // Do cleanup before shutdown
  // Return a promise to delay exit
})
```

Prexit is a simple function that takes a callback. This will be called with the signal and exit code / error on the following `process` events.

`uncaughtException | SIGTSTP | SIGQUIT | SIGHUP | SIGTERM | SIGINT`

You can call prexit as many times as you'd like so you can do cleanup in the relevant places in your code. Prexit will await all promises that callbacks returns, and will ensure they are only called once. After all the promises finalizes prexit will call `prexit.ondone()` which defaults to calling `process.exit()`.

You can also supply optional events to listen for as the first argument of prexit.
 
```js
prexit('uncaughtException', (signal, err) => /* uncaughtException */ )
prexit(['SIGHUP', 'SIGTERM'], (signal, err) => /* SIGHUP | SIGTERM */ )
````
