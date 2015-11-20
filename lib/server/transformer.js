'use strict'

let EventEmitter = require('events').EventEmitter
let storage = require('../utils/storage')

class Transformer extends EventEmitter {
  start(data) {
    // data.storageId = storage.filePath(data.id, 'RESPONSE')
    var self = this
    setTimeout(function() {
      self.emit('end', data)
    }, 2000)
  }
}

module.exports = Transformer
