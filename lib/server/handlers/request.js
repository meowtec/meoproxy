'use strict'

let url = require('url')
let http = require('http')
let https = require('https')
// let co = require('co')
let uuid = require('uuid')

let Transformer = require('../transformer')
let storage = require('../../utils/storage')
let resources = require('../res')
let _ = require('../../utils/utils')
let event = require('../../utils/event')
let cert = require('../cert')
let ________________ = _.log

module.exports = function(scheme, req, res) {

  let id = uuid.v1()
  let headers = req.headers
  let reqUrl = req.url
  let method = req.method

  // req.url 为 /path/to/xxx, 说明是直接访问代理
  if (reqUrl.startsWith('/') && scheme === 'http') {
    ________________('用户直接访问代理服务器', reqUrl)

    let urlObj = url.parse(reqUrl)
    // 用户扫描下载 CA
    if (urlObj.pathname === '/ca.crt') {
      cert.getCerts('rootca').then(function(cert) {
        res.end(cert.cert)
      })
      return
    }
    else {
      res.end('hello myproxy.')
      return
    }
  }

  let options, factory

  // 删除请求头中的参数
  delete headers['accept-encoding'] // 不要 gzip，简单粗暴

  // HTTP 代理
  if (scheme === 'http') {
    factory = http
    let {hostname, port, path} = url.parse(reqUrl)
    options = {
      hostname: hostname,
      port: port,
      path: path,
      method: method,
      headers: headers
    }
  }
  // HTTPS 中间人
  else {
    factory = https
    let [hostname, port] = headers.host.split(':')
    options = {
      hostname: hostname,
      port: port,
      path: req.url,
      method: method,
      headers: headers
    }
  }

  // 记录事件
  event.emit('http-data', {
    id: id,
    ssl: scheme === 'https',
    state: 'BEFORE_REQUEST',
    data: options
  })


  ________________(`${method}: ${scheme}://${options.hostname}${options.port ? ':' + options.port : ''}${options.path}`)

  // 连接远程服务器
  let 上游请求 = factory.request(options)

  // write data to request body
  // req.on('data', 上游请求.write.bind(上游请求))
  // req.on('end', 上游请求.end.bind(上游请求))
  req.pipe(上游请求)

  // 浏览器请求结束
  // 对于直接 pipe 到远程 request 的 request，当 request 结束时，发送一个 emit
  // 上游请求.on('finish', () => {
  //   event.emit('http-data', {
  //     id: id,
  //     state: 'FINISH_REQUEST',
  //   })
  // })

  上游请求.on('response', function(上游响应) {
    let editable = true
    let status = 上游响应.statusCode
    let headers = 上游响应.headers
    let transformer

    // 不需要编辑的响应
    if (!editable) {
      res.writeHead(status, headers)
      上游响应.pipe(res)
      event.emit('http-data', {
        id: id,
        state: 'RESPONSE',
        data: {
          status,
          headers
        }
      })
    } else {
      transformer = new Transformer()
    }

    // 把响应写入文件
    // fs 写速度远大于 response 的读流速度，所以可以直接写
    let storageId = id
    let writeStream = storage.writeStream(storageId)

    // 远程服务器返回数据
    上游响应.on('data', function(data) {
      writeStream.write(data)
    })

    // 远程服务器返回数据结束，调用 transformer 转化
    上游响应.on('end', function() {
      writeStream.end()
      transformer && transformer.start({
        status: status,
        headers: headers,
        id: storageId
      })
      event.emit('http-data', {
        state: 'END_RESPONSE',
        id
      })
    })

    // 转化完成后返回给浏览器
    transformer && transformer.on('end', function(data) {
      ________________('用户修改 response 完成')
      res.writeHead(data.status, data.headers)

      let readStream = storage.readStream(data.id)
      readStream.pipe(res)
      event.emit('http-data', {
        state: 'MODIFIED_RESPONSE',
        id,
        data
      })
    })
  })

  // 出错的时候
  上游请求.on('error', function(e) {
    ________________('problem with request: ' + e.message)
    res.writeHead(502, {'Content-Type': 'text/html'})
    res.end(resources.get('502.html'))
    event.emit('http-data', {
      state: 'ERROR',
      id
    })
  })

}
