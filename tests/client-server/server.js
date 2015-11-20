'use strict'

var https = require('https')
var fs = require('fs')
var path = require('path')
var url = require('url')

// utils
var pathGen = dirname => name => path.resolve(__dirname, dirname, name)

var certPath = pathGen('cert')

var options = {
  key: fs.readFileSync(certPath('localhost.key')),
  cert: fs.readFileSync(certPath('localhost.crt'))
}

var baseHeaders = {
  'content-type': 'text/html; charset=utf-8',
  'X-Powered-By': 'myproxy-test-server',
  'Set-Cookie': ['username=meowtec', 'sessionID=qvy90xg5oy9zfr']
}

var mimeTypes = {
  'html': 'text/html',
  'png': 'image/png',
  '': 'application/octet-stream'
}

var mimeType = filename => {
  var match = filename.match(/\.(.*)?$/)
  var ext = match ? match[1] : ''
  return mimeTypes[ext] || mimeTypes['']
}

var resourcePath = pathGen('resources')

var returnStaticFile = (res, name) => {
  var headers = Object.assign({}, baseHeaders, {
    'content-type': mimeType(name)
  })
  res.writeHead(200, headers)
  fs.createReadStream(resourcePath(name)).pipe(res)
}

var router = {
  '/': 'index.html',

  '/png': 'image.png',

  '/redirect'(req, res) {
    res.writeHead(302, Object.assign({}, baseHeaders, {
      'Location': req.query.to || ''
    }))
    res.end()
  },

  ''(req, res) {
    res.writeHead(404, baseHeaders)
    res.end('<h2>404 Not Found</h2>')
  }
}

var requestListener = (req, res) => {
  console.log(req.method + ' ' + req.url)

  var urls = url.parse(req.url, true)
    ;['pathname', 'query'].forEach(key => req[key] = urls[key])
  var handler = router[urls.pathname] || router['']

  setTimeout(() => {
    if (typeof handler === 'string') {
      return returnStaticFile(res, handler)
    }
    handler(req, res)
  }, Math.random() * 1500)
}

module.exports = port => {
  var server = https.createServer(options, requestListener)
  server.listen(port)
  return server
}
