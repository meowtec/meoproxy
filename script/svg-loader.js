module.exports = function (content) {
  this.cacheable && this.cacheable()
  this.value = content

  return `
    var el = document.createElement('div')
    el.innerHTML = ${JSON.stringify(content)}
    var svg = el.children[0]
    svg.style.display = 'none'
    setTimeout(() => document.body.insertBefore(svg, document.body.firstChild))
  `
}
