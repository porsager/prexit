const handlers = {}

let exitPromise = Promise.resolve()

module.exports = prexit

function prexit(signals, fn) {
  if (typeof signals === 'function') {
    fn = signals
    signals = prexit.signals
  }

  let called = false
  ;[].concat(signals).forEach(signal => handle(signal, function() {
    if (called) return
    called = true
    return fn.apply(fn, arguments)
  }))
}

function handle(signal, fn) {
  const handler = handlers[signal]
  if (handler)
    return handler.push(fn)

  const fns = handlers[signal] = [fn]

  process.on(signal, function(err) {
    signal === 'uncaughtException' && prexit.logExceptions && console.error((err && 'stack' in err) ? err.stack : new Error(err).stack)
    exitPromise = exitPromise.then(() => Promise.all(fns.map(fn =>
      Promise.resolve(fn.apply(fn, arguments))
    )))
    .catch(() => prexit.code = prexit.code || 1)
    .then(prexit.ondone)
  })
}

prexit.code = 0
prexit.logExceptions = true
prexit.ondone = () => process.exit(prexit.code) // eslint-disable-line
prexit.signals = ['beforeExit', 'uncaughtException', 'SIGTSTP', 'SIGQUIT', 'SIGHUP', 'SIGTERM', 'SIGINT']
