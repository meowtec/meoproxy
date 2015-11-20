'use strict'

let textFileTypes = [
  // 'text/html',
  // 'text/css',
  // 'text/plain',
  'application/json',
  'application/javascript',
  'image/svg+xml'
]

let detectEncode = content => {
  let charset = content.match(/charset=([\w\-]+)/)
  if (!charset) {
    return charset
  }
  return charset[1]
}

let isText = content => {
  // 去掉后面的 `;charset`
  let contentMine = content.replace(/.*;/, '')

  return /text/i.test(contentMine) || textFileTypes.indexOf(contentMine) > -1
}

exports.detectEncode = detectEncode
exports.isText = isText
