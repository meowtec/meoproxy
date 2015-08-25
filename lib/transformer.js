'use strict'

let EventEmitter = require('events').EventEmitter

class Transformer extends EventEmitter {
  start(data) {
    var self = this
    setTimeout(function() {
      self.emit('end', data)
    }, 2000)
  }
}

module.exports = Transformer
