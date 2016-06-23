{
  const dev = process.env.MEOP_ENV === 'dev_watch'
  const staticBase = dev ? 'http://localhost:11200/static/' : './'

  window.loadAsset = (path) => {
    let script = document.createElement('script')
    script.src = staticBase + path + '.js'
    document.head.appendChild(script)

    if (dev) {
      const link = document.querySelector('[href="' + path + '.css"]')
      if(link) {
        link.parentNode.removeChild(link)
      }
    }
  }
}
