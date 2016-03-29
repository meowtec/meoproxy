'use strict'

export function none() {}

export function genUrl(protocol: string, hostname: string, port: string, path: string) {
  let portPart = (!port || Number(port) === 80) ? '' : (':' + port)

  return protocol + '://' + hostname + portPart + path
}

export function parseQS(url: string) {
  let qs = url.replace(/.*\?/, '')

  return qs.split('&').reduce(function(obj, item) {
    const [key, value] = item.split('=')
    obj[decodeURIComponent(key)] = decodeURIComponent(value || '')
    return obj
  }, {})
}

export function addClass(className: string, condition: boolean) {
  return condition ? className : ''
}

export function toString(value) {
  return value == null ? '' : (value + '')
}

export function trimIndent(string: string) {
  const lines = string.split('\n')
  if (lines.length < 3 || lines[0].trim() !== '') {
    return string
  }

  const indent = lines[1].match(/^\s*/)[0].length
  return lines.slice(1, lines.length - 1).map(line => line.slice(indent)).join('\n')
}

export let id
{
  const baseDate = Date.now()
  let idCount = -1

  id = function id() {
    idCount ++
    return baseDate + '-' + idCount
  }
}
