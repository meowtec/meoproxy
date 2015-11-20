'use strict'

var fs = require('fs')
var path = require('path')
var request = require('request')
var co = require('co')
var EventEmitter = require('events')
var _ = require('../../lib/utils/utils')

var readAsBuffer = relativePath => {
  return fs.readFileSync(path.resolve(__dirname, relativePath))
}

var req = request.defaults({
  proxy: 'http://127.0.0.1:8899',
  ca: readAsBuffer('../../cert/rootca.crt')
})

var delay = time => {
  return new Promise(function(r) {
    setTimeout(r, time)
  })
}

var responsePromisify = emitter => _.emitterPromisify(emitter, 'response')

module.exports = port => {
  var client = new EventEmitter()

  co(function *() {
    yield delay(500)
    yield responsePromisify(req.post(`https://localhost:${port}/`).form({
      'username': 'Berton Zhu',
      'address': '中国浙江',
      'desc': '(null? (= x y))'
    }))
    yield delay(1500)
    yield responsePromisify(req.get(`https://localhost:${port}/png`))
    yield delay(1500)
    yield responsePromisify(req.get(`https://localhost:${port}/redirect?to=/`))
    yield delay(500)
  }).then(() => client.emit('finish'))

  return client
}
