var dateFormat = require('dateformat')
require('colors')

exports.timeout = function(ms) {
  var timer

  return function(callback) {
    clearTimeout(timer)
    callback && (timer = setTimeout(callback, ms))
  }
}

exports.log = function() {
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
  arr.unshift(`[${dateFormat("h:MM:ss")}]`)

  console.log.apply(console, arr)
}

exports.parseHost = function(host) {
  var tuple = host.split(':')
  return {
    host: tuple[0],
    port: parseInt(tuple[1], 10)
  }
}

exports.emitterPromisify = function(emitter, eventName) {
  return new Promise(function(resolve, reject) {
    emitter.on(eventName, function() {
      resolve(arguments)
    })
  })
}
