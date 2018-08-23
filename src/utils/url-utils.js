export default {
  parse (url) {
    let a = document.createElement('a')
    a.href = url

    let params = {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      file: (a.pathname.match(/\/([^/?#]+)$/i) || [null, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || [null, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/'),
      params: (function () {
        let seg = a.search.replace(/^\?/, '').split('&').filter(function (v, i) {
          if (v !== '' && v.indexOf('=')) {
            return true
          }
        })

        let ret = {}
        seg.forEach(function (element, index) {
          let idx = element.indexOf('=')
          let key = element.substring(0, idx)

          ret[key] = element.substring(idx + 1)
        })

        return ret
      })()
    }

    return Object.freeze(params)
  }
}
