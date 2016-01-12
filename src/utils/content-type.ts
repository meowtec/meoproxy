'use strict'

const textFileTypes = [
  'application/json',
  'application/javascript',
  'image/svg+xml'
]

export function detectEncode(content: string) {
  const charset = content.match(/charset=([\w\-]+)/)
  if (!charset) {
    return null
  }
  return charset[1]
}

export function isText(content: string) {
  if (!content) return true
  // 去掉后面的 `;charset`
  const contentMine = content.replace(/.*;/, '')

  return /text/i.test(contentMine) || textFileTypes.indexOf(contentMine) > -1
}
