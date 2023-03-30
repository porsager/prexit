const handlers = {}
    , last = []

let finished = false

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

prexit.signals = ['exit', 'beforeExit', 'uncaughtException', 'unhandledRejection', 'SIGTSTP', 'SIGQUIT', 'SIGHUP', 'SIGTERM', 'SIGINT']
prexit.logExceptions = true

prexit.last = addLast
prexit.exit = exit
prexit.ondone = ondone

function addLast(fn) {
  last.length || prexit(() => {})
  last.push(fn)
}

function exit(signal, code, error) {
  if (typeof signal === 'number') {
    error = code
    code = signal
    signal = 'prexit'
  }

  code && (process.exitCode = code)
  Object.keys(handlers).length
    ? process.emit('prexit', error)
    : process.exit()
}

function ondone(signal, error) {
  process.exit() // eslint-disable-line
}

function handle(signal, fn) {
  const handler = handlers[signal]
  if (handler)
    return handler.push(fn)

  const fns = handlers[signal] = [fn]

  process.on(signal, async function(error) {
    error === signal && (error = null)
    if ((signal === 'uncaughtException' || signal === 'unhandledRejection') && prexit.logExceptions)
      console.error(error) // eslint-disable-line

    try {
      const xs = fns.map(fn => fn(signal, error)).filter(x => x && typeof x.then === 'function')
      xs.length && await Promise.all(xs)
    } catch (error) {
      process.exitCode || (process.exitCode = 1)
      prexit.logExceptions && console.error(error) // eslint-disable-line
    }

    done(signal, error)
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
