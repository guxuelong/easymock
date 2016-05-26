// 备份原生 XMLHttpRequest
window._XMLHttpRequest = window.XMLHttpRequest
window._ActiveXObject = window.ActiveXObject
const XHR_STATES = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
}
const XHR_EVENTS = ["readystatechange", "loadstart", "progress", "abort", "error", "load", "timeout", "loadend"]
const XHR_REQUEST_PROPERTIES = ["timeout", "withCredentials"]
const XHR_RESPONSE_PROPERTIES = ["readyState", "responseURL", "status", "statusText", "responseType", "response", "responseText", "responseXML"]


class MockXHR {
  constructor() {
    this.custom = {
      events: {},
      requestHeaders: {},
      responseHeaders: {
        'content-type': 'json'
      }
    }
    this._settings = {
      timeout: '10-100'
    }
    Object.assign(this, {
      mock: true,
      match: false,
      timeout: 0,
      withCredentials: false,
      upload: {},
      responseURL: '',
      status: XHR_STATES.UNSENT,
      statusText: '',
      responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
      response: null,
      responseText: '',
      responseXML: null
    })

  }

  open(method, url, async, username, password) {
    Object.assign(this.custom, {
      method: method,
      url: url,
      async: typeof async === 'boolean' ? async : true,
      username: username,
      password: password,
      options: {
        url: url,
        type: method,
      }
    })
    // 查找与请求参数匹配的数据模板
    let item = find(this.custom.options)

    let handle = (event) => {
      // 同步属性 NativeXMLHttpRequest => MockXMLHttpRequest
      for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
        try {
          this[XHR_RESPONSE_PROPERTIES[i]] = this.custom.xhr[XHR_RESPONSE_PROPERTIES[i]]
        } catch (e) {}
      }
      // 触发 MockXMLHttpRequest 上的同名事件
      this.dispatchEvent(new Event(event.type /*, false, false, that*/ ))
    }

    let calculateTimeout = (timeout) => {
      if (typeof timeout === 'number') return timeout
      if (typeof timeout === 'string' && !~timeout.indexOf('-')) return parseInt(timeout, 10)
      if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
        var tmp = timeout.split('-')
        var min = parseInt(tmp[0], 10)
        var max = parseInt(tmp[1], 10)
        return Math.round(Math.random() * (max - min)) + min
      }
    }

    // 如果未找到匹配的数据模板，则采用原生 XHR 发送请求。
    if (!item) {
      // 创建原生 XHR 对象，调用原生 open()，监听所有原生事件
      //var xhr = createNativeXMLHttpRequest()
      this.custom.xhr = createNativeXMLHttpRequest()
        // 初始化所有事件，用于监听原生 XHR 对象的事件
      for (let i = 0; i < XHR_EVENTS.length; i++) {
        this.custom.xhr.addEventListener(XHR_EVENTS[i], handle)
      }

      // xhr.open()
      if (username) this.custom.xhr.open(method, url, async, username, password)
      else this.custom.xhr.open(method, url, async)

      // 同步属性 MockXMLHttpRequest => NativeXMLHttpRequest
      for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
        try {
          this.custom.xhr[XHR_REQUEST_PROPERTIES[j]] = this[XHR_REQUEST_PROPERTIES[j]]
        } catch (e) {}
      }

      return
    }

    // 找到了匹配的数据模板，开始拦截 XHR 请求
    this.match = true;
    this.custom.template = item;
    this.custom.timeout = calculateTimeout(item.timeout || this._settings.timeout);
    this.readyState = XHR_STATES.OPENED
    this.dispatchEvent(new Event('readystatechange' /*, false, false, this*/ ))
  }

  setRequestHeader(name, value) {
    // 原生 XHR
    if (!this.match) {
      this.custom.xhr.setRequestHeader(name, value)
      return
    }

    // 拦截 XHR
    var requestHeaders = this.custom.requestHeaders
    if (requestHeaders[name]) requestHeaders[name] += ',' + value
    else requestHeaders[name] = value
  }

  send(data) {
    var that = this
    this.custom.options.body = data

    // 原生 XHR
    if (!this.match) {
      this.custom.xhr.send(data)
      return
    }

    // 拦截 XHR

    // X-Requested-With header
    this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest')

    // loadstart The fetch initiates.
    this.dispatchEvent(new Event('loadstart' /*, false, false, this*/ ))

    if (this.custom.async) setTimeout(done, this.custom.timeout) // 异步
    else done() // 同步

    function done() {
      that.readyState = XHR_STATES.HEADERS_RECEIVED
      that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
      that.readyState = XHR_STATES.LOADING
      that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))

      that.status = 200
      that.statusText = 'OK'

      // fix #92 #93 by @qddegtya
      that.response = that.responseText = JSON.stringify(that.custom.template.result, null, 4)
      that.readyState = XHR_STATES.DONE
      that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
      that.dispatchEvent(new Event('load' /*, false, false, that*/ ));
      that.dispatchEvent(new Event('loadend' /*, false, false, that*/ ));
    }
  }

  // abort() {
  //   // 原生 XHR
  //   if (!this.match) {
  //     this.custom.xhr.abort()
  //     return
  //   }

  //   // 拦截 XHR
  //   this.readyState = XHR_STATES.UNSENT
  //   this.dispatchEvent(new Event('abort', false, false, this))
  //   this.dispatchEvent(new Event('error', false, false, this))
  // }

  getResponseHeader(name) {
    // 原生 XHR
    if (!this.match) {
      return this.custom.xhr.getResponseHeader(name)
    }

    // 拦截 XHR
    return this.custom.responseHeaders[name.toLowerCase()]
  }

  getAllResponseHeaders() {
    // 原生 XHR
    if (!this.match) {
      return this.custom.xhr.getAllResponseHeaders()
    }

    // 拦截 XHR
    var responseHeaders = this.custom.responseHeaders
    var headers = ''
    for (var h in responseHeaders) {
      if (!responseHeaders.hasOwnProperty(h)) continue
      headers += h + ': ' + responseHeaders[h] + '\r\n'
    }
    return headers
  }

  //overrideMimeType( /*mime*/ ) {}

  addEventListener(type, handle) {
      var events = this.custom.events
      if (!events[type]) events[type] = []
      events[type].push(handle)
    }
    // removeEventListener(type, handle) {
    //   var handles = this.custom.events[type] || []
    //   for (var i = 0; i < handles.length; i++) {
    //     if (handles[i] === handle) {
    //       handles.splice(i--, 1)
    //     }
    //   }
    // }
  dispatchEvent(event) {
    var handles = this.custom.events[event.type] || []
    for (var i = 0; i < handles.length; i++) {
      handles[i].call(this, event)
    }

    var ontype = 'on' + event.type
    if (this[ontype]) this[ontype](event)
  }
}


// Inspired by jQuery
function createNativeXMLHttpRequest() {
  var isLocal = function() {
    var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
    var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
    var ajaxLocation = location.href
    var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
    return rlocalProtocol.test(ajaxLocParts[1])
  }()

  return window.ActiveXObject ?
    (!isLocal && createStandardXHR() || createActiveXHR()) : createStandardXHR()

  function createStandardXHR() {
    try {
      return new window._XMLHttpRequest();
    } catch (e) {}
  }

  function createActiveXHR() {
    try {
      return new window._ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
  }
}


// 查找与请求参数匹配的数据模板：URL，Type
function find(options) {
  //Object.keys({a:1,b:2,c:3}).includes('a')
  let md5Key = MockXHR.Easymock.md5(options.url + options.type.toLowerCase());
  if (Object.keys(MockXHR.Easymock._mocked).includes(md5Key)) {
    return MockXHR.Easymock._mocked[md5Key];
  }
}
export default MockXHR;