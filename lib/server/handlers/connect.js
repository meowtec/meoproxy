var net = require('net')
var co = require('co')

var _ = require('../../utils/utils')
var httpServerPool = require('../https-server-pool')

var ________________ = _.log


module.exports = function(req, socket) {
  co(function *() {
    ________________(req.method + ':' + req.url)

    var hostInfo = _.parseHost(req.url)
    // var upSocket = net.connect(hostInfo)
    var httpsPort = yield httpServerPool.getServer(hostInfo.host)
    ________________('get proxy https server: ', hostInfo, httpsPort)
    hostInfo.host = '127.0.0.1'
    hostInfo.port = httpsPort
    var upSocket = net.connect(hostInfo)

    upSocket.on('connect', function() {
      ________________('connect up socket')
      socket.write('HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n', 'UTF-8')
      upSocket.pipe(socket)
      socket.pipe(upSocket)
    })
  }).catch(function(e) {
    ________________(e.stack)
  })
}
