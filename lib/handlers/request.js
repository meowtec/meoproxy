'use strict'

let url = require('url')
let http = require('http')
let https = require('https')
let co = require('co')
let uuid = require('uuid')

let Transformer = require('../transformer')
let storage = require('../storage')
let resources = require('../res/')
let _ = require('../utils')
let ________________ = _.log

module.exports = function(scheme, req, res) {

  let headers = req.headers
  let reqUrl = req.url
  let method = req.method

  if (reqUrl.startsWith('/') && scheme === 'http') {
    ________________('用户直接访问代理服务器')
    res.end('hello myproxy.')
    return
  }

  let options, factory

  // 删除请求头中的参数
  delete headers['accept-encoding'] // 不要 gzip，简单粗暴
  console.log(headers)

  // HTTP 代理
  if (scheme === 'http') {
    factory = http
    let uriObj = url.parse(reqUrl)
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
    let hostTuple = headers.host.split(':')
    options = {
      hostname: hostTuple[0],
      port: hostTuple[1],
      path: req.url,
      method: method,
      headers: headers
    }
  }

  ________________(`${method}: ${scheme}://${options.hostname}${options.port ? ':' + options.port : ''}${options.path}`)

  // 连接远程服务器
  let upstreamRequest = factory.request(options)

  upstreamRequest.on('response', function(upstreamResponse) {
    let editable = true
    let status = upstreamResponse.statusCode
    let headers = upstreamResponse.headers

    // 不需要编辑的响应
    if (!editable) {
      res.writeHead(status, headers)
      upstreamResponse.pipe(res)
    }

    // 把响应写入文件
    // fs 写速度远大于 response 的读流速度，所以可以直接写
    let storageId = uuid.v1()
    let writeStream = storage.writeStream(storageId)

    let transformer = new Transformer()

    upstreamResponse.on('data', function(data) {
      writeStream.write(data)
    })

    upstreamResponse.on('end', function() {
      writeStream.end()
      transformer.start({
        status: status,
        headers: headers,
        id: storageId
      })
    })

    transformer.on('end', function(data) {
      ________________('用户修改 response 完成')
      res.writeHead(data.status, data.headers)

      let readStream = storage.readStream(data.id)
      readStream.pipe(res)
    })
  })

  upstreamRequest.on('error', function(e) {
    ________________('problem with request: ' + e.message)
    res.writeHead(502, {'Content-Type': 'text/html'})
    res.end(resources.get('502.html'))
  })

  // write data to request body
  // req.on('data', upstreamRequest.write.bind(upstreamRequest))
  // req.on('end', upstreamRequest.end.bind(upstreamRequest))
  req.pipe(upstreamRequest)

}

