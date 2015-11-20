require('./css/ca.less')

var QRCode = window.QRCode
var ip = require('./utils/utils').parseQS().ip

var downloadLink = `http://${ip}:8899/ca.crt`

QRCode(document.getElementById('qrcode'), downloadLink)
document.getElementById('download').href = downloadLink
