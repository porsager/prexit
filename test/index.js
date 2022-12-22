import prexit from '../index.js'

prexit((...args) => {
  console.log('Received', args)
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('before resolve')
      resolve()
      setTimeout(() => console.log('after resolve'), 0)
    }, 1000)
  })
})

setTimeout(() => {}, 1000000)

prexit('SIGINT', (...args) => {
  console.log('Received2', args)
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('before resolve2')
      resolve()
    }, 1500)
  })
})

setTimeout(() => {
  prexit.exit()
}, 1500)
