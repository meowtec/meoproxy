var https = require('https')
var co = require('co')

var _ = require('../utils/utils')
var cert = require('./cert')
var requestHandler = require('./handlers/request')
var ________________ = _.log

var SERVER_POOL = {}

function getServer(domain, callback) {
  return co(function *() {
    var cache = SERVER_POOL[domain]
    var cacheAddress = cache && cache.address()
    if (cacheAddress) {
      return cacheAddress.port
    }

    var certData = yield cert.getCerts(domain)

    var newServer = https.createServer(certData)

    // LISTEN: 随机分配 port
    // 待 listening 触发进行下一步
    yield _.emitterPromisify(newServer.listen(0), 'listening')

    var port = newServer.address().port
    ________________('Create a new HTTPS server: ', port)

    // 如果 server 持续 60s 内没有收到请求，则关闭
    var _timeout = _.timeout(600000)

    newServer.on('timeoff', function() {
      _timeout(function() {
        newServer.close()
      })
    })

    newServer.on('request', requestHandler.bind(null, 'https'))

    newServer.emit('timeoff')

    // 加入池
    SERVER_POOL[domain] = newServer

    // 关闭 Server 时从池中移除
    newServer.on('close', function() {
      ________________('HTTPS server close: ', port)
      delete SERVER_POOL[domain]
    })

    return port
  })
}

exports.getServer = getServer
