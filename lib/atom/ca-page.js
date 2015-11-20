var BrowserWindow = require('browser-window')
var ip = require('ip')

module.exports = function() {
  var caWindow = new BrowserWindow({width: 300, height: 400})
  caWindow.loadUrl('file://' + __dirname + '/../../gui/ca.html?ip=' + ip.address())
}
