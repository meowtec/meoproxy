export function genUrl(ssl, host, port, path) {
  let portPart = (!port || Number(port) === 80) ? '' : (':' + port)

  return (ssl ? 'https' : 'http') + '://' + host + portPart + path
}
