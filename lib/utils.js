exports.timeout = function(ms) {
  var timer

  return function(callback) {
    clearTimeout(timer)
    callback && (timer = setTimeout(callback, ms))
  }
}
