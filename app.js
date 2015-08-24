var http = require('http')
var https = require('https')
var net = require('net')
var url = require('url')

var ____ = require('./lib/utils')
var httpHandlers = {
  connect: require('./lib/handlers/connect'),
  request: require('./lib/handlers/request')
}

var proxy = http.createServer()

// HTTP 代理服务器
proxy.on('request', httpHandlers.request.bind(null, 'http'))
proxy.on('connect', httpHandlers.connect)

proxy.listen(8899, '127.0.0.1')
