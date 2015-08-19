var https = require('https')

var _ = require('./utils')
var cert = require('./cert')
var serverPool = {}

function getServer(domain, callback) {
  // 从 server 池中取 server
  var cache = serverPool[domain]
  if (cache) {
    return callback && callback(null, cache.address().port)
  }

  // 如果池子中没有对应的 Server，则创建一个

  cert.getCerts(domain).then(function(data) {

    var newServer = https.createServer(data)
    var port

    // 随机分配 port
    newServer.listen(0, function(server) {
      port = newServer.address().port
      callback && callback(null, port)
    })

    // 如果 server 持续 60s 内没有收到请求，则关闭
    var _timeout = _.timeout(60000)
    var lazyClose = function() {
      _timeout(function() {
        newServer.close()
      })
    }

    newServer.on('responseEnd', lazyClose)

    newServer.on('request', function() {
      // test
      newServer.emit('responseEnd')

      // TODO: 代理
    })

    lazyClose()

    // 加入池
    serverPool[domain] = newServer

    // 关闭 Server 时从池中移除
    newServer.on('close', function() {
      console.log('https server close: ', port)
      delete serverPool[domain]
    })
  })
  .catch(function(e) {
    console.log(e)
  })
}

getServer('zhihu.com')
