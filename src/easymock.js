/*
 * author：carry
 * 前端本地化开发最佳实践
 * 
 *
 *
 */

var Util = require('./mock/util')
var XHR;
if (typeof window !== 'undefined') XHR = require('./mock/xhr')



var Easymock = {
    Util: Util,
    XHR: XHR,
    heredoc: Util.heredoc,
    setup: function(settings) {
        return XHR.setup(settings)
    },
    _mocked: {}
}

Easymock.version = '0.0.1'

// 避免循环依赖
if (XHR) XHR.Easymock = Easymock

Easymock.mock = function(rurl, rtype, template) {
    if (arguments.length === 1) {
        return rurl;
    }
    if (arguments.length === 2) {
        template = rtype
        rtype = undefined
    }
    // 拦截 XHR
    if (XHR) window.XMLHttpRequest = XHR
    Easymock._mocked[rurl + (rtype || '')] = {
        rurl: rurl,
        rtype: rtype,
        template: template
    }
    return Easymock
}
module.exports = Easymock;