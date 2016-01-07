'use strict'

declare var QRCode: Function

import { parseQS } from '../utils/utils'

const ip = parseQS(document.location.href)['ip']
const downloadLink = `http://${ip}:8899/ca.crt`
QRCode(document.getElementById('qrcode'), downloadLink)
(<HTMLAnchorElement>document.getElementById('download')).href = downloadLink
