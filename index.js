const handlers = {}
    , last = []

let exitPromise = Promise.resolve()
  , finished = false

export default prexit

function prexit(signals, fn) {
  if (typeof signals === 'function') {
    fn = signals
    signals = prexit.signals
  }

  let called = false
  ;['prexit'].concat(signals).forEach(signal => handle(signal, function(signal, error) {
    if (called)
      return
    called = true
    return fn(signal, error)
  }))
}

prexit.signals = ['beforeExit', 'uncaughtException', 'SIGTSTP', 'SIGQUIT', 'SIGHUP', 'SIGTERM', 'SIGINT']
prexit.logExceptions = true

prexit.last = fn => last.push(fn)
prexit.exit = exit
prexit.ondone = ondone

function exit(signal, code, error) {
  if (typeof signal === 'number') {
    error = code
    code = signal
    signal = 'prexit'
  }

  code && (process.exitCode = code)
  Object.keys(handlers).length
    ? process.emit('prexit', signal || 'prexit', error)
    : process.exit()
}

function ondone(error) {
  console.error(error) // eslint-disable-line
  process.exit() // eslint-disable-line
}

function handle(signal, fn) {
  const handler = handlers[signal]
  if (handler)
    return handler.push(fn)

  const fns = handlers[signal] = [fn]

  process.on(signal, function(error) {
    if (signal === 'uncaughtException' && prexit.logExceptions)
      console.error((error && 'stack' in error) ? error.stack : new Error(error).stack) // eslint-disable-line

    exitPromise = Promise.all(fns.map(fn =>
      Promise.resolve(fn(signal, error))
    ).concat(exitPromise))
    .catch(() => process.exitCode || (process.exitCode = 1))
    .then(() => done(signal, error))
  })
}

function done(signal, error) {
  if (finished)
    return

  finished = true
  try {
    last.forEach(fn => fn(signal))
  } catch (err) {
    error
      ? console.error(err) // eslint-disable-line
      : error = err
  }

  prexit.ondone(signal, error)
}
