[![version](https://img.shields.io/npm/v/prexit.svg)]() [![license](https://img.shields.io/github/license/porsager/prexit.svg)]()

# 🚪 Prexit

A graceful way to shutdown / handle **PR**ocess **EXIT** - way better than other \*rexits

```js
import prexit from 'prexit'

prexit((signal, [err]) => {
  // Do cleanup before shutdown
  // Return a promise to delay exit
  // set prexit.code to exit with non 0
  // eg prexit.code = 1
})
```

Here's a sample for shutting down an http server and database.
First we stop the http server from accepting any new connections.
Then we gracefully close the database connection to allow any pending queries to resolve.

```js
prexit(async () => {
  await new Promise(r => server.close(r))
  await db.end({ timeout: 5 })
})
```

Prexit is a simple function that takes a callback. This will be called with the signal and exit code / error on the following `process` events.

`exit | beforeExit | uncaughtException | unhandledRejection | SIGTSTP | SIGQUIT | SIGHUP | SIGTERM | SIGINT`

You can call prexit as many times as you'd like so you can do cleanup in the relevant places in your code. Prexit will await all promises that callbacks returns, and will ensure they are only called once. After all the promises are settled prexit will call `prexit.ondone()` which defaults to calling `process.exit(prexit.code)`.

If you need to do synchronous cleanup after any async cleanup and right before prexit.ondone is called, you can use `prexit.last(fn)`

```js
prexit.last(() => {
  // This will run after any async handlers right 
  // before exit, meaning only sync cleanup
  // eg. (kill child processes)
})
```

You can also supply optional events to listen for as the first argument of prexit.
 
```js
prexit('uncaughtException', (signal, err) => /* uncaughtException */ )
prexit(['SIGHUP', 'SIGTERM'], (signal, err) => /* SIGHUP | SIGTERM */ )
````
