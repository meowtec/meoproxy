var url = require('url')
var http = require('http')
var https = require('https')
var net = require('net')
var co = require('co')

var resources = require('../res/')
var _ = require('../utils')
var ________________ = _.log

module.exports = function(scheme, req, res) {

  var headers = req.headers
  var reqUrl = req.url
  var method = req.method

  if (reqUrl.startsWith('/') && scheme === 'http') {
    ________________('用户直接访问代理服务器')
    res.end('hello myproxy.')
    return
  }

  var options, factory

  // HTTP 代理
  if (scheme === 'http') {
    factory = http
    var uriObj = url.parse(reqUrl)
    options = {
      hostname: uriObj.hostname,
      port: uriObj.port,
      path: uriObj.path,
      method: method,
      headers: headers
    }
  }
  // HTTPS 中间人
  else {
    factory = https
    var hostTuple = headers.host.split(':')
    options = {
      hostname: hostTuple[0],
      port: hostTuple[1],
      path: req.url,
      method: method,
      headers: headers
    }
  }

  ________________(`${method}: ${scheme}://${options.hostname}:${options.port}${options.path}`)
  ________________(headers)

  // 连接远程服务器
  var upstreamRequest = factory.request(options)

  upstreamRequest.on('response', function(upstreamResponse) {
    res.writeHead(upstreamResponse.statusCode, upstreamResponse.headers)

    // upstreamResponse.on('data', res.write.bind(res))
    // upstreamResponse.on('end', res.end.bind(res))
    upstreamResponse.pipe(res)
  })

  upstreamRequest.on('error', function(e) {
    ________________('problem with request: ' + e.message);
    res.writeHead(502, {'Content-Type': 'text/html'})
    res.end(resources.get('502.html'))
  });

  // write data to request body
  // req.on('data', upstreamRequest.write.bind(upstreamRequest))
  // req.on('end', upstreamRequest.end.bind(upstreamRequest))
  req.pipe(upstreamRequest)
}

