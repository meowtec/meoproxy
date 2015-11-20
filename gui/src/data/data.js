let ipc = require('ipc')
let event = require('../utils/event')
let assert = require('assert')
let __ = require('lodash')
let storage = require('../../../lib/utils/storage')

let timeline = [] // Map -> React Elements 性能较低

timeline.get = function(id) {
  return this.find(function(item) {
    return item.id === id
  })
}

// 监听守护进程发起的 `http-data` 事件。
// 守护进程中某个 HTTP 发生改变时，给浏览器进程发送消息。
// 浏览器进程把消息插入/更新到消息列表
ipc.on('http-data', data => {
  console.log(`ipc.on('http-data', data => `, data)

  // BEFORE_REQUEST 为 HTTP 请求发送前。
  // 把消息插入到 timeline 列表
  let item
  if (data.state === 'BEFORE_REQUEST') {
    item = Object.assign({}, data)

    item.request = item.data
    item.data = null
    item.requestBodyId = item.storageId

    timeline.unshift(item)

    console.log('debug BEFORE_REQUEST', item.requestBodyId)
  }
  else {
    item = timeline.get(data.id)

    if (!item) {
      return // Ignore error.
    }

    Object.assign(item, data)

    switch (item.state) {

      case 'MODIFIED_REQUEST':
        // item.rawRequest = item.request
        // item.request = item.data
        // item.modifiedRequestBodyId= item.storageId
        break

      case 'RESPONSE':
        item.response = item.data
        item.responseBodyId = item.storageId
        break

      case 'MODIFIED_RESPONSE':
        item.rawResponse = item.response
        item.response = item.data
        item.modifiedResponseBodyId = item.storageId
    }

    item.storageId = item.data = null

  }

  event.emit('timeline-update', item)
})

// 获取 TimeLine
exports.getTimeline = () => timeline

// 获取记录细则
// TODO: 缓存最近几次的 bodyData

exports.getItem = (id) => {
  assert(__.isString(id), `getItem(id) id 必须是字符串, 现在是 ${id}`)
  assert(id.indexOf('.') === -1, 'id 不能是 storageId, 现在是 ${id}')

  let baseDetail = timeline.get(id)
  let detail = {
    request: {headers: {}},
    response: {headers: {}}
  }

  // TODO: 当 state 在某一步之后都需要获取 body
  // 可以考虑 state 使用 Number,方便比较大小

  if (baseDetail.state === 'MODIFIED_RESPONSE') {
    detail.responseBody = storage.readFile(baseDetail.modifiedResponseBodyId).toString() // ipc.sendSync('get-body-data', baseDetail.modifiedResponseBodyId)

    detail.requestBody = storage.readFile(baseDetail.requestBodyId).toString()

    console.log('detail.responseBody/requestBody length', detail.responseBody.length, detail.requestBody.length)
  }

  return Object.assign(detail, baseDetail)
}
