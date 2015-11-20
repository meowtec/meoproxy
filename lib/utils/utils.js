var Buffer = require('buffer').Buffer
var dateFormat = require('dateformat')

// console.log colorful text
require('colors')


var _ = {
  none() {},

  // debounce(100)(function() {})
  // debounce(function() {}, 100)()
  debounce(fun, wait) {
    var timer, func0, waitMs

    if (typeof fun === 'function') {
      func0 = fun
      waitMs = wait
    }
    else {
      func0 = null
      waitMs = fun
    }

    return func1 => {
      clearTimeout(timer)
      var fun = func1 || func0
      fun && (timer = setTimeout(fun, waitMs))
    }
  },

  log() {
    var arr = [].slice.call(arguments).map(function(item) {
      var type = typeof item

      if (type === 'string') {
        return item.yellow
      }

      if (type === 'number') {
        return item.toString().white
      }

      if (item === true) {
        return 'true'.green
      }

      if (item === false) {
        return 'false'.magenta
      }

      return item
    })
    arr.unshift(`[${dateFormat('h:MM:ss')}]`)

    console.log.apply(console, arr)
  },

  parseHost(host) {
    var tuple = host.split(':')
    return {
      host: tuple[0],
      port: parseInt(tuple[1] || 80, 10)
    }
  },

  emitterPromisify(emitter, eventName) {
    var value, done
    emitter.on(eventName, function() {
      value = arguments
      done = true
    })
    return new Promise(function(resolve) {
      if (done) {
        resolve.apply(null, value)
      }
      else {
        emitter.on(eventName, resolve)
      }
    })
  },

  streamReadAll(readable) {
    return new Promise(function(resolve, reject) {
      var buffers = []

      readable.on('data', function(data) {
        buffers.push(data)
      })

      readable.on('end', function() {
        resolve(Buffer.concat(buffers))
      })

      readable.on('error', function(e) {
        reject(e)
      })
    })
  }

}

module.exports = _
