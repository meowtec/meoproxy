let ipc = require('ipc')
let event = require('../utils/event')

let timeline = [] // Map -> React Elements 性能较低

timeline.get = function(id) {
  return this.find(function(item) {
    return item.id === id
  })
}
var __count = 0
ipc.on('http-data', data => {
  console.log(`ipc.on('http-data', data => {\n`, data)

  // 根据 data 的属性，往 timeline 插入 或者 更新
  if (data.state === 'BEFORE_REQUEST') {
    let item = Object.assign({}, data)

    item.request = item.data
    item.data = null

    timeline.unshift(item)

    console.log(__count++)
  }
  else {
    let item = timeline.get(data.id)

    if (!item) {
      return // Ignore error.
    }

    Object.assign(item, data)

    switch (item.state) {

      case 'RESPONSE':
        item.response = item.data
        break

      case 'MODIFIED_RESPONSE':
        item.rawResponse = item.response
        item.response = item.data
    }

    item.data = null

  }

  event.emit('timeline-update')
})

// setInterval(() => {
//   timeline.push({
//     id: Date.now(),
//     host: 'https://rennet.com',
//     path: '/taintworm/unipara?a=sphenotribe&b=soapboxer#indocility',
//     status: '200',
//     method: 'GET'
//   })
//   event.emit('timeline-update')
// }, 2000)

exports.getTimeline = () => timeline
