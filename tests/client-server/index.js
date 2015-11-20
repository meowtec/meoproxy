'use strict'

var port = 9327
var server = require('./server')(port)
var client = require('./client')(port)

client.on('finish', function() {
  server.close()
})
