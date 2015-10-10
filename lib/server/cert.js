var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var spawn = require('child_process').spawn
var Promise = require('bluebird')
var co = require('co')

// add fs.readFileAsync
Promise.promisifyAll(fs)

// return Error
function spawnError(childProcess) {
  var err = new Error('Spawn error:\n' + childProcess.spawnargs.join(' '))
  err.name = 'SpawnError'
  return err
}

// wrap childProcess to promise
var promiseWarp = function(childProcess) {
  return new Promise(function(resolve, reject) {
    childProcess.stderr.pipe(process.stdout)

    childProcess.on('close', function(err) {
      err ? reject(spawnError(childProcess)) : resolve()
    })
  })
}

// 证书文件存储目录
var certPath = path.resolve(__dirname, '../../cert')

// 如果证书目录不存在，则创建
// 创建失败会抛错
mkdirp.sync(certPath)

// 创建 ROOT CA key
var genCAKey = function() {
  return spawn('openssl', ['genrsa', '-out', certPath + '/rootca.key', '2048'])
}

// 给 ROOT CA key 自签名得到证书
var genCACert = function() {
  return spawn('openssl',
    ['req', '-new', '-x509', '-sha256',
      '-days', '9999',
      '-key', certPath + '/rootca.key',
      '-out', certPath + '/rootca.crt',
      '-subj', '/C=CN/ST=Zhejiang/L=Hangzhou/O=Meowtec/OU=Meowtec/CN=MeowtecCA/emailAddress=bertonzh@gmail.com'
    ])
}

var genKey = function(domain) {
  return spawn('openssl', ['genrsa', '-out', `${certPath}/${domain}.key`, '2048'])
}

var genReq = function(domain) {
  return spawn('openssl', [
    'req',
    '-new',
    '-key', `${certPath}/${domain}.key`,
    '-out', `${certPath}/${domain}.csr`,
    '-subj', `/C=CN/ST=Zhejiang/L=Hangzhou/O=Meowtec/OU=Meowtec/CN=${domain}/emailAddress=bertonzh@gmail.com`
  ])
}

var genCert = function(domain) {
  return spawn('openssl', [
    'x509',
    '-req',
    '-days', '9999',
    '-sha256',
    '-in', `${certPath}/${domain}.csr`,
    '-CA', `${certPath}/rootca.crt`,
    '-CAkey', `${certPath}/rootca.key`,
    '-CAcreateserial',
    '-out', `${certPath}/${domain}.crt`
  ])
}

// 读文件
// @return Promise
var readCerts = function(domain) {
  return co(function *() {
    var key = yield fs.readFileAsync(`${certPath}/${domain}.key`)
    var cert = yield fs.readFileAsync(`${certPath}/${domain}.crt`)

    return {
      key: key,
      cert: cert
    }
  })
}

var rootCAExist = function() {
  return fs.existsAsync(certPath + '/rootca.key')
}

exports.rootCAExist = rootCAExist

// @return Promise
exports.getCerts = function(domain) {
  return co(function *() {
    return yield readCerts(domain)
  })
  .catch(function() {
    return co(function *() {
      yield promiseWarp(genKey(domain))
      yield promiseWarp(genReq(domain))
      yield promiseWarp(genCert(domain))
      yield fs.unlinkAsync(`${certPath}/${domain}.csr`)
      return yield readCerts(domain)
    })
  })
}

// 每次启动时尝试创建 CA 根证书
co(function *() {
  var isRootCAExist = yield rootCAExist()
  if (!isRootCAExist) {
    yield promiseWarp(genCAKey())
    yield promiseWarp(genCACert())
  }
})
