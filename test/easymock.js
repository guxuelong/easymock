/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * author：carry
	 * 前端本地化开发最佳实践
	 * 支持单个URL以及多个URL的MOCK
	 *  
	 *
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _mockXhr = __webpack_require__(2);

	var _mockXhr2 = _interopRequireDefault(_mockXhr);

	var _mockUtil = __webpack_require__(4);

	var _mockUtil2 = _interopRequireDefault(_mockUtil);

	// 构建单例模式
	var getInstance = (function () {
	  var instance = undefined;
	  return function (newInstance) {
	    if (newInstance) instance = newInstance;
	    return instance;
	  };
	})();

	var Easymock = (function () {
	  //构造函数

	  function Easymock(name) {
	    _classCallCheck(this, Easymock);

	    if (getInstance()) return getInstance();
	    this.XHR = _mockXhr2['default'];
	    this.version = '0.0.1';
	    this._mocked = {};
	    var instance = getInstance(this);
	    this.defaultOptions = {
	      url: '',
	      type: 'get',
	      timeout: 3000,
	      async: true,
	      data: {},
	      result: {}
	    };
	    // 避免循环依赖
	    _mockXhr2['default'].Easymock = instance;
	    window.XMLHttpRequest = _mockXhr2['default'];
	    return instance;
	  }

	  _createClass(Easymock, [{
	    key: 'setup',
	    value: function setup(settings) {
	      return _mockXhr2['default'].setup(settings);
	    }
	  }, {
	    key: 'mock',
	    value: function mock(options) {
	      var _this = this;

	      if (typeof options !== 'object') return console.error('invalid argument ');

	      if (!Array.isArray(options)) {
	        options = [options];
	      }

	      options.forEach(function (item) {
	        var ops = Object.assign({}, _this.defaultOptions, item);
	        if (!ops.url) {
	          return console.error('invalid argument ');
	        }
	        _this._mocked[_mockUtil2['default'].md5(ops.url + ops.type + JSON.stringify(ops.data))] = ops;
	      });
	    }
	  }]);

	  return Easymock;
	})();

	exports['default'] = Easymock;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(3);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Util = __webpack_require__(4);

	// 备份原生 XMLHttpRequest
	window._XMLHttpRequest = window.XMLHttpRequest;
	window._ActiveXObject = window.ActiveXObject;

	/*
	    PhantomJS
	    TypeError: '[object EventConstructor]' is not a constructor (evaluating 'new Event("readystatechange")')

	    https://github.com/bluerail/twitter-bootstrap-rails-confirm/issues/18
	    https://github.com/ariya/phantomjs/issues/11289
	*/
	try {
	    new window.Event('custom');
	} catch (exception) {
	    window.Event = function (type, bubbles, cancelable, detail) {
	        var event = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
	        event.initCustomEvent(type, bubbles, cancelable, detail);
	        return event;
	    };
	}

	var XHR_STATES = {
	    // The object has been constructed.
	    UNSENT: 0,
	    // The open() method has been successfully invoked.
	    OPENED: 1,
	    // All redirects (if any) have been followed and all HTTP headers of the response have been received.
	    HEADERS_RECEIVED: 2,
	    // The response's body is being received.
	    LOADING: 3,
	    // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
	    DONE: 4
	};

	var XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ');
	var XHR_REQUEST_PROPERTIES = 'timeout withCredentials'.split(' ');
	var XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ');

	// https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js#L32
	var HTTP_STATUS_CODES = {
	    100: "Continue",
	    101: "Switching Protocols",
	    200: "OK",
	    201: "Created",
	    202: "Accepted",
	    203: "Non-Authoritative Information",
	    204: "No Content",
	    205: "Reset Content",
	    206: "Partial Content",
	    300: "Multiple Choice",
	    301: "Moved Permanently",
	    302: "Found",
	    303: "See Other",
	    304: "Not Modified",
	    305: "Use Proxy",
	    307: "Temporary Redirect",
	    400: "Bad Request",
	    401: "Unauthorized",
	    402: "Payment Required",
	    403: "Forbidden",
	    404: "Not Found",
	    405: "Method Not Allowed",
	    406: "Not Acceptable",
	    407: "Proxy Authentication Required",
	    408: "Request Timeout",
	    409: "Conflict",
	    410: "Gone",
	    411: "Length Required",
	    412: "Precondition Failed",
	    413: "Request Entity Too Large",
	    414: "Request-URI Too Long",
	    415: "Unsupported Media Type",
	    416: "Requested Range Not Satisfiable",
	    417: "Expectation Failed",
	    422: "Unprocessable Entity",
	    500: "Internal Server Error",
	    501: "Not Implemented",
	    502: "Bad Gateway",
	    503: "Service Unavailable",
	    504: "Gateway Timeout",
	    505: "HTTP Version Not Supported"
	};

	/*
	    MockXMLHttpRequest
	*/

	function MockXMLHttpRequest() {
	    // 初始化 custom 对象，用于存储自定义属性
	    this.custom = {
	        events: {},
	        requestHeaders: {},
	        responseHeaders: {
	            'content-type': 'json'
	        }
	    };
	}

	MockXMLHttpRequest._settings = {
	    timeout: '10-100'
	};

	/*
	    timeout: 50,
	    timeout: '10-100',
	 */
	MockXMLHttpRequest.setup = function (settings) {
	    Object.assign(MockXMLHttpRequest._settings, settings);
	    return MockXMLHttpRequest._settings;
	};

	Object.assign(MockXMLHttpRequest, XHR_STATES);
	Object.assign(MockXMLHttpRequest.prototype, XHR_STATES);

	// 标记当前对象为 MockXMLHttpRequest
	MockXMLHttpRequest.prototype.mock = true;

	// 是否拦截 Ajax 请求
	MockXMLHttpRequest.prototype.match = false;

	// 初始化 Request 相关的属性和方法
	Object.assign(MockXMLHttpRequest.prototype, {
	    // https://xhr.spec.whatwg.org/#the-open()-method
	    // Sets the request method, request URL, and synchronous flag.
	    open: function open(method, url, async, username, password) {
	        var that = this;

	        Object.assign(this.custom, {
	            method: method,
	            url: url,
	            async: typeof async === 'boolean' ? async : true,
	            username: username,
	            password: password,
	            options: {
	                url: url,
	                type: method
	            }
	        });

	        this.custom.timeout = (function (timeout) {
	            if (typeof timeout === 'number') return timeout;
	            if (typeof timeout === 'string' && ! ~timeout.indexOf('-')) return parseInt(timeout, 10);
	            if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
	                var tmp = timeout.split('-');
	                var min = parseInt(tmp[0], 10);
	                var max = parseInt(tmp[1], 10);
	                return Math.round(Math.random() * (max - min)) + min;
	            }
	        })(MockXMLHttpRequest._settings.timeout);

	        // 查找与请求参数匹配的数据模板
	        var item = find(this.custom.options);

	        function handle(event) {
	            // 同步属性 NativeXMLHttpRequest => MockXMLHttpRequest
	            for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
	                try {
	                    that[XHR_RESPONSE_PROPERTIES[i]] = that.custom.xhr[XHR_RESPONSE_PROPERTIES[i]];
	                } catch (e) {}
	            }
	            // 触发 MockXMLHttpRequest 上的同名事件
	            that.dispatchEvent(new Event(event.type /*, false, false, that*/));
	        }

	        // 如果未找到匹配的数据模板，则采用原生 XHR 发送请求。
	        if (!item) {
	            // 创建原生 XHR 对象，调用原生 open()，监听所有原生事件
	            //var xhr = createNativeXMLHttpRequest()
	            this.custom.xhr = createNativeXMLHttpRequest();
	            // 初始化所有事件，用于监听原生 XHR 对象的事件
	            for (var i = 0; i < XHR_EVENTS.length; i++) {
	                this.custom.xhr.addEventListener(XHR_EVENTS[i], handle);
	            }

	            // xhr.open()
	            if (username) this.custom.xhr.open(method, url, async, username, password);else this.custom.xhr.open(method, url, async);

	            // 同步属性 MockXMLHttpRequest => NativeXMLHttpRequest
	            for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
	                try {
	                    this.custom.xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]];
	                } catch (e) {}
	            }

	            return;
	        }

	        // 找到了匹配的数据模板，开始拦截 XHR 请求
	        this.match = true;
	        this.custom.template = item;
	        this.readyState = MockXMLHttpRequest.OPENED;
	        this.dispatchEvent(new Event('readystatechange' /*, false, false, this*/));
	    },
	    // https://xhr.spec.whatwg.org/#the-setrequestheader()-method
	    // Combines a header in author request headers.
	    setRequestHeader: function setRequestHeader(name, value) {
	        // 原生 XHR
	        if (!this.match) {
	            this.custom.xhr.setRequestHeader(name, value);
	            return;
	        }

	        // 拦截 XHR
	        var requestHeaders = this.custom.requestHeaders;
	        if (requestHeaders[name]) requestHeaders[name] += ',' + value;else requestHeaders[name] = value;
	    },
	    timeout: 0,
	    withCredentials: false,
	    upload: {},
	    // https://xhr.spec.whatwg.org/#the-send()-method
	    // Initiates the request.
	    send: function send(data) {
	        var that = this;
	        this.custom.options.body = data;

	        // 原生 XHR
	        if (!this.match) {
	            this.custom.xhr.send(data);
	            return;
	        }

	        // 拦截 XHR

	        // X-Requested-With header
	        this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest');

	        // loadstart The fetch initiates.
	        this.dispatchEvent(new Event('loadstart' /*, false, false, this*/));

	        if (this.custom.async) setTimeout(done, this.custom.timeout); // 异步
	        else done(); // 同步

	        function done() {
	            that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED;
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/));
	            that.readyState = MockXMLHttpRequest.LOADING;
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/));

	            that.status = 200;
	            that.statusText = HTTP_STATUS_CODES[200];

	            // fix #92 #93 by @qddegtya
	            that.response = that.responseText = JSON.stringify(convert(that.custom.template, that.custom.options), null, 4);

	            that.readyState = MockXMLHttpRequest.DONE;
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/));
	            that.dispatchEvent(new Event('load' /*, false, false, that*/));
	            that.dispatchEvent(new Event('loadend' /*, false, false, that*/));
	        }
	    },
	    // https://xhr.spec.whatwg.org/#the-abort()-method
	    // Cancels any network activity.
	    abort: function abort() {
	        // 原生 XHR
	        if (!this.match) {
	            this.custom.xhr.abort();
	            return;
	        }

	        // 拦截 XHR
	        this.readyState = MockXMLHttpRequest.UNSENT;
	        this.dispatchEvent(new Event('abort', false, false, this));
	        this.dispatchEvent(new Event('error', false, false, this));
	    }
	});

	// 初始化 Response 相关的属性和方法
	Object.assign(MockXMLHttpRequest.prototype, {
	    responseURL: '',
	    status: MockXMLHttpRequest.UNSENT,
	    statusText: '',
	    // https://xhr.spec.whatwg.org/#the-getresponseheader()-method
	    getResponseHeader: function getResponseHeader(name) {
	        // 原生 XHR
	        if (!this.match) {
	            return this.custom.xhr.getResponseHeader(name);
	        }

	        // 拦截 XHR
	        return this.custom.responseHeaders[name.toLowerCase()];
	    },
	    // https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
	    // http://www.utf8-chartable.de/
	    getAllResponseHeaders: function getAllResponseHeaders() {
	        // 原生 XHR
	        if (!this.match) {
	            return this.custom.xhr.getAllResponseHeaders();
	        }

	        // 拦截 XHR
	        var responseHeaders = this.custom.responseHeaders;
	        var headers = '';
	        for (var h in responseHeaders) {
	            if (!responseHeaders.hasOwnProperty(h)) continue;
	            headers += h + ': ' + responseHeaders[h] + '\r\n';
	        }
	        return headers;
	    },
	    overrideMimeType: function overrideMimeType() /*mime*/{},
	    responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
	    response: null,
	    responseText: '',
	    responseXML: null
	});

	// EventTarget
	Object.assign(MockXMLHttpRequest.prototype, {
	    addEventListener: function addEventListener(type, handle) {
	        var events = this.custom.events;
	        if (!events[type]) events[type] = [];
	        events[type].push(handle);
	    },
	    removeEventListener: function removeEventListener(type, handle) {
	        var handles = this.custom.events[type] || [];
	        for (var i = 0; i < handles.length; i++) {
	            if (handles[i] === handle) {
	                handles.splice(i--, 1);
	            }
	        }
	    },
	    dispatchEvent: function dispatchEvent(event) {
	        var handles = this.custom.events[event.type] || [];
	        for (var i = 0; i < handles.length; i++) {
	            handles[i].call(this, event);
	        }

	        var ontype = 'on' + event.type;
	        if (this[ontype]) this[ontype](event);
	    }
	});

	// Inspired by jQuery
	function createNativeXMLHttpRequest() {
	    var isLocal = (function () {
	        var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
	        var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
	        var ajaxLocation = location.href;
	        var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
	        return rlocalProtocol.test(ajaxLocParts[1]);
	    })();

	    return window.ActiveXObject ? !isLocal && createStandardXHR() || createActiveXHR() : createStandardXHR();

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

	    for (var sUrlType in MockXMLHttpRequest.Easymock._mocked) {
	        var item = MockXMLHttpRequest.Easymock._mocked[sUrlType];
	        if ((!item.rurl || match(item.rurl, options.url)) && (!item.rtype || match(item.rtype, options.type.toLowerCase()))) {
	            return item;
	        }
	    }

	    function match(expected, actual) {
	        if (Util.type(expected) === 'string') {
	            return expected === actual;
	        }
	        if (Util.type(expected) === 'regexp') {
	            return expected.test(actual);
	        }
	    }
	}

	// 数据模板 ＝> 响应数据
	function convert(item, options) {
	    return Util.isFunction(item.template) ? item.template(options) : MockXMLHttpRequest.Easymock.mock(item.template);
	}

	module.exports = MockXMLHttpRequest;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _md5 = __webpack_require__(5);

	var _md52 = _interopRequireDefault(_md5);

	var Util = (function () {
	  function Util() {
	    _classCallCheck(this, Util);
	  }

	  _createClass(Util, null, [{
	    key: 'md5',
	    value: function md5(str) {
	      if (typeof str != 'string') return console.error('invalid argument for Util.md5');
	      return _md52['default'].hex_md5(str);
	    }
	  }]);

	  return Util;
	})();

	exports['default'] = Util;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(6);

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var hexcase = 0;
	var b64pad = "";

	var Md5 = (function () {
	  function Md5() {
	    _classCallCheck(this, Md5);
	  }

	  _createClass(Md5, null, [{
	    key: "hex_md5",
	    value: function hex_md5(s) {
	      return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
	    }
	  }, {
	    key: "str2rstr_utf8",
	    value: function str2rstr_utf8(input) {
	      var output = "";
	      var i = -1;
	      var x, y;

	      while (++i < input.length) {
	        /* Decode utf-16 surrogate pairs */
	        x = input.charCodeAt(i);
	        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
	        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
	          x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
	          i++;
	        }

	        /* Encode output as utf-8 */
	        if (x <= 0x7F) output += String.fromCharCode(x);else if (x <= 0x7FF) output += String.fromCharCode(0xC0 | x >>> 6 & 0x1F, 0x80 | x & 0x3F);else if (x <= 0xFFFF) output += String.fromCharCode(0xE0 | x >>> 12 & 0x0F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);else if (x <= 0x1FFFFF) output += String.fromCharCode(0xF0 | x >>> 18 & 0x07, 0x80 | x >>> 12 & 0x3F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
	      }
	      return output;
	    }
	  }, {
	    key: "rstr_md5",
	    value: function rstr_md5(s) {
	      return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
	    }
	  }, {
	    key: "binl2rstr",
	    value: function binl2rstr(input) {
	      var output = "";
	      for (var i = 0; i < input.length * 32; i += 8) output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
	      return output;
	    }
	  }, {
	    key: "rstr2binl",
	    value: function rstr2binl(input) {
	      var output = Array(input.length >> 2);
	      for (var i = 0; i < output.length; i++) output[i] = 0;
	      for (var i = 0; i < input.length * 8; i += 8) output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
	      return output;
	    }
	  }, {
	    key: "binl_md5",
	    value: function binl_md5(x, len) {
	      /* append padding */
	      x[len >> 5] |= 0x80 << len % 32;
	      x[(len + 64 >>> 9 << 4) + 14] = len;

	      var a = 1732584193;
	      var b = -271733879;
	      var c = -1732584194;
	      var d = 271733878;

	      for (var i = 0; i < x.length; i += 16) {
	        var olda = a;
	        var oldb = b;
	        var oldc = c;
	        var oldd = d;

	        a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
	        d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
	        c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
	        b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
	        a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
	        d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
	        c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
	        b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
	        a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
	        d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
	        c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
	        b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
	        a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
	        d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
	        c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
	        b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

	        a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
	        d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
	        c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
	        b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
	        a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
	        d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
	        c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
	        b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
	        a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
	        d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
	        c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
	        b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
	        a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
	        d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
	        c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
	        b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

	        a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
	        d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
	        c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
	        b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
	        a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
	        d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
	        c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
	        b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
	        a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
	        d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
	        c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
	        b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
	        a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
	        d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
	        c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
	        b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

	        a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
	        d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
	        c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
	        b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
	        a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
	        d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
	        c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
	        b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
	        a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
	        d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
	        c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
	        b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
	        a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
	        d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
	        c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
	        b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

	        a = this.safe_add(a, olda);
	        b = this.safe_add(b, oldb);
	        c = this.safe_add(c, oldc);
	        d = this.safe_add(d, oldd);
	      }
	      return Array(a, b, c, d);
	    }
	  }, {
	    key: "md5_cmn",
	    value: function md5_cmn(q, a, b, x, s, t) {
	      return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
	    }
	  }, {
	    key: "md5_ff",
	    value: function md5_ff(a, b, c, d, x, s, t) {
	      return this.md5_cmn(b & c | ~b & d, a, b, x, s, t);
	    }
	  }, {
	    key: "md5_gg",
	    value: function md5_gg(a, b, c, d, x, s, t) {
	      return this.md5_cmn(b & d | c & ~d, a, b, x, s, t);
	    }
	  }, {
	    key: "md5_hh",
	    value: function md5_hh(a, b, c, d, x, s, t) {
	      return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
	    }
	  }, {
	    key: "md5_ii",
	    value: function md5_ii(a, b, c, d, x, s, t) {
	      return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
	    }
	  }, {
	    key: "safe_add",
	    value: function safe_add(x, y) {
	      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	      return msw << 16 | lsw & 0xFFFF;
	    }
	  }, {
	    key: "rstr2hex",
	    value: function rstr2hex(input) {
	      try {
	        hexcase;
	      } catch (e) {
	        hexcase = 0;
	      }
	      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	      var output = "";
	      var x;
	      for (var i = 0; i < input.length; i++) {
	        x = input.charCodeAt(i);
	        output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
	      }
	      return output;
	    }
	  }, {
	    key: "bit_rol",
	    value: function bit_rol(num, cnt) {
	      return num << cnt | num >>> 32 - cnt;
	    }
	  }]);

	  return Md5;
	})();

	exports["default"] = Md5;
	module.exports = exports["default"];

/***/ }
/******/ ]);