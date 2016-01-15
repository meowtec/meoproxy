'use strict'

import { Readable } from 'stream'

export function none() {}

export function debounce(wait: number, fun0?: Function) {
  let timer

  return (func1?: Function) => {
    clearTimeout(timer)
    let fun = func1 || fun0

    fun && (timer = setTimeout(fun, wait))
  }
}

export function parseHost(host: string) {
  let tuple = host.split(':')
  return {
    host: tuple[0],
    port: parseInt(tuple[1] || '80', 10)
  }
}

export function streamReadAll(readable: Readable) {
  return new Promise(function(resolve, reject) {
    let buffers = []

    readable.on('data', function(data) {
      buffers.push(data)
    })

    readable.on('end', function() {
      resolve(Buffer.concat(buffers))
    })

    readable.on('error', function(e) {
      reject(e)
    })
  })
}

export function genUrl(ssl: boolean, hostname: string, port: string, path: string) {
  let portPart = (!port || Number(port) === 80) ? '' : (':' + port)

  return (ssl ? 'https' : 'http') + '://' + hostname + portPart + path
}

export function parseQS(url: string) {
  let qs = url.replace(/.*\?/, '')

  return qs.split('&').reduce(function(obj, item) {
    const kv = item.split('=')
    obj[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '')
    return obj
  }, {})
}

export function addClass(className: string, condition: boolean) {
  return condition ? className : ''
}

export function toString(value) {
  return value == null ? '' : value
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
