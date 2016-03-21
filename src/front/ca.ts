'use strict'

import * as ip from 'ip'
import './ca.less'
import * as QRCode from 'qrcode'

const ipAddr = ip.address()
const downloadLink = `http://${ipAddr}:8899/ca.crt`
new QRCode(document.getElementById('qrcode'), downloadLink)
; (<HTMLAnchorElement>document.getElementById('download')).href = downloadLink
