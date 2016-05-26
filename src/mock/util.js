import MD5 from './md5';

class Util {
  static md5(str) {
    if (typeof(str) != 'string') return console.error('invalid argument for Util.md5');
    return MD5.hex_md5(str)
  }
}

export default Util;