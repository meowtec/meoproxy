var http = require('http')
// var ____ = require('../utils/utils')

var httpHandlers = {
  connect: require('./handlers/connect'),
  request: require('./handlers/request')
}

var proxy = http.createServer()

// HTTP 代理服务器
proxy.on('request', httpHandlers.request.bind(null, 'http'))
proxy.on('connect', httpHandlers.connect)

proxy.listen(8899, '0.0.0.0')
