var _ = require('./utils')
var url = require('url')
var http = require('http')
var https = require('https')
var net = require('net')

var ________________ = _.log

exports.request = function(req, res) {

  var headers = req.headers
  var reqUrl = req.url
  var method = req.method

  ________________(method + ': ' + reqUrl)
  var uriObj = url.parse(reqUrl)

  if (!uriObj.hostname) {
    ________________('用户直接访问代理服务器')
    res.end('hello myproxy.')
    return
  }

  // 连接远程服务器
  var upstreamRequest = http.request({
    hostname: uriObj.hostname,
    port: uriObj.port,
    path: uriObj.path,
    method: method,
    headers: headers
  })

  upstreamRequest.on('response', function(upstreamResponse) {
    res.writeHead(upstreamResponse.statusCode, upstreamResponse.headers)

    // upstreamResponse.on('data', res.write.bind(res))
    // upstreamResponse.on('end', res.end.bind(res))
    upstreamResponse.pipe(res)
  })

  upstreamRequest.on('error', function(e) {
    ________________('problem with request: ' + e.message);
  });

  // write data to request body
  // req.on('data', upstreamRequest.write.bind(upstreamRequest))
  // req.on('end', upstreamRequest.end.bind(upstreamRequest))
  req.pipe(upstreamRequest)
}


exports.connect = function(req, socket) {
  ________________(req.method + ':' + req.url)

  var opts = _.parseHost(req.url)
  var upSocket = net.connect(opts)

  upSocket.on('connect', function() {
    socket.write('HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n', 'UTF-8')
    upSocket.on('data', function(data) {
      console.log(data.toString())
    })
    upSocket.pipe(socket)
    socket.pipe(upSocket)
  })
}