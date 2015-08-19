var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var exec = require('child_process').exec
var spawn = require('child_process').spawn
var Promise = require('bluebird')
var co = require('co')

// add fs.readFileAsync
Promise.promisifyAll(fs)

//
function spawnError (childProcess) {
  var err = new Error('Spawn error:\n' + childProcess.spawnargs.join(' '))
  err.name = 'SpawnError'
  return err
}

// wrap childProcess to promise
var promiseWarp = function(childProcess) {
  return new Promise(function(resolve, reject) {
    childProcess.stderr.on('data', function(data) {
      console.log(data.toString())
    })

    childProcess.on('close', function(err) {
      err ? reject(spawnError(childProcess)) : resolve()
    })
  })
}

// 证书文件存储目录
var certPath = path.resolve(__dirname, '../cert')

// 如果证书目录不存在，则创建
// 创建失败会抛错
mkdirp.sync(certPath)

// 创建 ROOT CA key
var genCAKey = function() {
  return spawn('openssl', ['genrsa', '-out', certPath + '/rootca.key'])
}

// 给 ROOT CA key 自签名得到证书
var genCACert = function() {
  return spawn('openssl',
    ['req', '-new', '-x509', '-sha256',
      '-days', '9999',
      '-key', certPath + '/rootca.key',
      '-out', certPath + '/rootca.crt',
      '-subj', '/C=CN/ST=Zhejiang/L=Hangzhou/O=Meowtec/OU=Meowtec/CN=Meowtec/emailAddress=bertonzh@gmail.com'
    ])
}

var genKey = function(domain) {
  return spawn('openssl', ['genrsa', '-out', `${certPath}/${domain}.key`])
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
  var key

  return fs.readFileAsync(`${certPath}/${domain}.key`)
    .then(function(value) {
      key = value
      return fs.readFileAsync(`${certPath}/${domain}.crt`)
    })
    .then(function(value) {
      return {
        key: key,
        cert: value
      }
    })
}

exports.getRootCert = function() {

}

// 根据 domain 获取私钥和证书
// @return Promise
exports.getCerts = function(domain) {
  return readCerts(domain)
    .catch(function() {
      return promiseWarp(genKey(domain))
        .then(function() {
          return promiseWarp(genReq(domain))
        })
        .then(function() {
          return promiseWarp(genCert(domain))
        })
        .then(function() {
          return fs.unlinkAsync(`${certPath}/${domain}.csr`)
        })
        .then(function() {
          return readCerts(domain)
        })
    })
}

// exports.getCerts('www.baidu.com')
// .then(function(data) {
//   console.log(data)
// })
// .catch(function(e) {
//   console.log('e', e)
// })
