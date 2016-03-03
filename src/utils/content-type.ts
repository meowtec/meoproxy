'use strict'

const textFileTypes = [
  'text', 'json', 'javascript', 'xml'
]

const textFileRegexp = new RegExp(textFileTypes.join('|'))

export function detectEncode(content: string) {
  const charset = content.match(/charset=([\w\-]+)/)
  if (!charset) {
    return null
  }
  return charset[1]
}

export function isText(content: string) {
  if (!content) return true
  return textFileRegexp.test(content)
}
