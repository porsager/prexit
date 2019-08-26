# Prexit 

A graceful way to shutdown / handle process exit

```
const prexit = require('prexit')

prexit((signal, code || err) => {
  // Do cleanup before shutdown
  // Return a promise to delay exit
})
```
