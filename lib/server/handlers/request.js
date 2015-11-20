'use strict'

let url = require('url')
let assert = require('assert')
let co = require('co')
let uuid = require('uuid')
let __ = require('lodash')

let Transformer = require('../transformer')
let storage = require('../../utils/storage')
let resources = require('../res')
let _ = require('../../utils/utils')
let event = require('../../utils/event')
let cert = require('../cert')
let ________________ = _.log

// 如果是 production 环境，proxy 请求远程服务器时会忽略证书认证失败的情况
// 以方便本地调试
let rejectUnauthorized = process.argv.indexOf('--production') === -1

module.exports = function(scheme, req, res) {
  co(function *() {

    let id = uuid.v1()
    let requestHeaders = req.headers
    let requestUrl = req.url
    let method = req.method

    // req.url 为 /path/to/xxx, 说明是直接访问代理
    if (requestUrl.startsWith('/') && scheme === 'http') {
      ________________('用户直接访问代理服务器', requestUrl)

      let urlObj = url.parse(requestUrl)
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

    let baseRequestOptions
    let factory = require(scheme)

    // 删除请求头中的参数
    delete requestHeaders['accept-encoding'] // 不要 gzip，简单粗暴

    // HTTP 代理
    if (scheme === 'http') {
      let {hostname, port, path} = url.parse(requestUrl)
      baseRequestOptions = {
        hostname,
        port,
        path,
        method,
        headers: requestHeaders
      }
    }
    // HTTPS 中间人
    else {
      let [hostname, port] = requestHeaders.host.split(':')
      baseRequestOptions = {
        hostname,
        port,
        path: req.url,
        method,
        headers: requestHeaders,
        rejectUnauthorized
      }
    }

    ________________(`${method}: ${scheme}://${baseRequestOptions.hostname}${baseRequestOptions.port ? ':' + baseRequestOptions.port : ''}${baseRequestOptions.path}`)

    let requestEditable = true
    let responseEditable = true

    // 把本地 request body 存储
    let requestStorageId = storage.filePath(id, 'REQUEST')
    let requestWriteStream = storage.writeStream(requestStorageId)

    req.pipe(requestWriteStream)

    // 等待存储完毕
    yield _.emitterPromisify(req, 'end')

    // 记录事件
    event.emit('http-data', {
      id,
      ssl: scheme === 'https',
      state: 'BEFORE_REQUEST',
      data: baseRequestOptions,
      storageId: requestStorageId
    })

    let requestOptions, upstreamRequestStorageId

    // 请求可编辑
    if (requestEditable) {
      let upstreamRequestTransformer = new Transformer()
      upstreamRequestTransformer.start({
        headers: requestHeaders,
        id,
        storageId: requestStorageId
      })

      // 等待转换器完成转换
      let upstreamRequestTransformerData = yield _.emitterPromisify(upstreamRequestTransformer, 'end')
      requestOptions = Object.assign({}, baseRequestOptions, {headers: upstreamRequestTransformerData.headers})
      upstreamRequestStorageId = upstreamRequestTransformerData.storageId

      event.emit('http-data', {
        state: 'MODIFIED_REQUEST',
        id,
        data: upstreamRequestTransformerData,
        storageId: upstreamRequestTransformerData.storageId
      })
    }

    else {
      requestOptions = baseRequestOptions
      upstreamRequestStorageId = requestStorageId
    }

    // 请求上游服务器
    let upstreamRequest = factory.request(requestOptions)
    let upstreamRequestBodyStream = storage.readStream(upstreamRequestStorageId)

    upstreamRequestBodyStream.pipe(upstreamRequest)

    // 出错的时候
    upstreamRequest.on('error', function(e) {
      ________________('problem with request: ' + e.message)
      res.writeHead(502, {'Content-Type': 'text/html'})
      res.end(resources.get('502.html'))
      event.emit('http-data', {
        state: 'ERROR',
        id
      })
    })

    // 上游请求完毕
    upstreamRequest.on('finish', function() {
      // TODO emit http-data
    })

    // 等待上游请求开始响应数据（上游响应）
    let upstreamResponse = yield _.emitterPromisify(upstreamRequest, 'response')

    let status = upstreamResponse.statusCode
    let responseHeaders = upstreamResponse.headers
    let transformer

    // 响应数据可以编辑
    if (responseEditable) {
      transformer = new Transformer()
    }
    else {
      // 如果响应数据不可编辑, 直接返回给浏览器
      // 避免浏览器卡顿的现象
      res.writeHead(status, responseHeaders)
      upstreamResponse.pipe(res)
      event.emit('http-data', {
        id: id,
        state: 'RESPONSE',
        data: {
          status,
          headers: responseHeaders
        }
      })
    }

    // 把响应写入文件
    // fs 写速度远大于 response 的读流速度，所以可以直接写
    let responseStorageId = storage.filePath(id, 'RESPONSE')
    let writeStream = storage.writeStream(responseStorageId)

    // 远程服务器返回数据
    upstreamResponse.on('data', function(data) {
      writeStream.write(data)
    })

    // 等待远程服务器返回数据结束
    yield _.emitterPromisify(upstreamResponse, 'end')

    writeStream.end()

    event.emit('http-data', {
      state: 'END_RESPONSE',
      id,
      storageId: responseStorageId
    })

    // 如果响应是不可编辑的, 到这里就完成了
    // 如果可以编辑, 继续下面动作
    if (!transformer) {
      return
    }

    transformer.start({
      status,
      headers: responseHeaders,
      id,
      storageId: responseStorageId
    })

    var responseTransformerData = yield _.emitterPromisify(transformer, 'end')

    let newStorageId = responseTransformerData.storageId
    assert(__.isString(newStorageId), 'transformer end data.storageId 必须是字符串')
    ________________('用户修改 response 完成')
    // 把用户修改后的 status 和 headers 返回给浏览器
    res.writeHead(responseTransformerData.status, responseTransformerData.headers)
    // 把修改后的body返回
    let readStream = storage.readStream(newStorageId)
    readStream.pipe(res)
    // TODO readStream on error

    event.emit('http-data', {
      state: 'MODIFIED_RESPONSE',
      id,
      data: responseTransformerData,
      storageId: newStorageId
    })
  })
}
