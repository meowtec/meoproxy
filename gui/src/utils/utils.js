export function genUrl(ssl, host, port, path) {
  let portPart = (!port || Number(port) === 80) ? '' : (':' + port)

  return (ssl ? 'https' : 'http') + '://' + host + portPart + path
}

export function parseQS(url) {
  url = url || location.search
  var qs = url.replace(/.*\?/, '')

  return qs.split('&').reduce(function(obj, item) {
    var kv = item.split('=')
    obj[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '')
    return obj
  }, {})
}
