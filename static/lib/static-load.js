{
  const staticBase = process.env.MEOP_ENV === 'dev_watch' ? 'http://localhost:11200/static/' : './'

  window.staticLoad = {
    css(path) {
      let link = document.createElement('link')
      link.href =  staticBase + path
      link.rel = 'stylesheet'
      link.type = 'text/css'
      document.head.appendChild(link)
    },
    js(path) {
      let script = document.createElement('script')
      script.src = staticBase + path
      document.head.appendChild(script)
    }
  }
}
