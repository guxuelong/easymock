/*
 * author：carry
 * 前端本地化开发最佳实践
 * 支持单个URL以及多个URL的MOCK
 *  
 *
 */
import XHR from './mock/xhr';
import Util from './mock/util'

// 构建单例模式
let getInstance = (function() {
  let instance;
  return (newInstance) => {
    if (newInstance) instance = newInstance;
    return instance;
  }
}());

class Easymock {
  //构造函数
  constructor(name) {
    if (getInstance()) return getInstance();
    this.XHR = XHR;
    this.version = '0.0.1';
    this.md5 = Util.md5;
    this._mocked = {}
    let instance = getInstance(this);
    this.defaultOptions = {
        url: '',
        type: 'get',
        timeout: 3000,
        async: true,
        data: {},
        result: {}
      }
      // 避免循环依赖
    XHR.Easymock = instance
    window.XMLHttpRequest = XHR
    return instance;
  }

  setup(settings) {
    return XHR.setup(settings)
  }


  mock(options) {

    if (typeof(options) !== 'object') return console.error('invalid argument ');

    if (!Array.isArray(options)) {
      options = [options];
    }

    options.forEach((item) => {
      let ops = Object.assign({}, this.defaultOptions, item);
      if (!ops.url) {
        return console.error('invalid argument ');
      }
      this._mocked[Util.md5(ops.url + ops.type.toLowerCase())] = ops;
    })
  }
}
export default Easymock;


