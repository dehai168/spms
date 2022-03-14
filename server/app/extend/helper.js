'use strict';
const crypto = require('crypto');
const fs = require('fs');
const DESKEY = 'spms1234';

const util = {
  desEncrypt(str) {
    const key = Buffer.from(DESKEY, 'utf8');
    const iv = Buffer.from(DESKEY, 'utf8');
    const alg = 'des-cbc';
    const cipher = crypto.createCipheriv(alg, key, iv);
    cipher.setAutoPadding(true);
    let ciph = cipher.update(str, 'utf8', 'hex');
    ciph += cipher.final('hex');
    return ciph;
  },
  desDecrypt(str) {
    const key = Buffer.from(DESKEY, 'utf8');
    const iv = Buffer.from(DESKEY, 'utf8');
    const alg = 'des-cbc';

    const ciph = decodeURIComponent(str);
    const decipher = crypto.createDecipheriv(alg, key, iv);
    decipher.setAutoPadding(true);
    let txt = decipher.update(ciph, 'hex', 'utf8');
    txt += decipher.final('utf8');

    return txt;
  },
  getToken(str) {
    try {
      if (str) {
        const jsonStr = this.desDecrypt(str);
        return JSON.parse(jsonStr);
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  setToken(object) {
    return this.desEncrypt(JSON.stringify(object));
  },
  guid() {
    const S4 = function () {
      return ((1 + Math.random()) * 0x10000 || 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4();
  },
  bytes2Str(arr) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      let tmp = arr[i].toString(16);
      if (tmp.length === 1) {
        tmp = '0x' + tmp;
      }
      str += '0x' + tmp + ' ';
    }
    return str;
  },
  writeFile(path, content) {
    fs.writeFileSync(path, content);
  },
  readFile(path) {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path, 'utf-8').toString();
    }
    return null;
  },
  formatDate(type, obj) {
    let now = new Date();
    if (typeof obj === 'object') {
      now = obj;
    }
    if (typeof obj === 'string') {
      now = new Date(obj);
    }
    const date = `${now.getFullYear()}-${this.toRound(now.getMonth() + 1)}-${this.toRound(now.getDate())}`;
    if (type === 'date') {
      return date;
    } else if (type === 'time') {
      const time = `${this.toRound(now.getHours())}:${this.toRound(now.getMinutes())}:${this.toRound(now.getSeconds())}`;
      return `${time}`;
    } else if (type === 'datetime') {
      const time = `${this.toRound(now.getHours())}:${this.toRound(now.getMinutes())}:${this.toRound(now.getSeconds())}`;
      return `${date} ${time}`;
    } else if (type === 'timespan') {
      const time = `${this.toRound(now.getHours())}:${this.toRound(now.getMinutes())}`;
      return `${time}`;
    }
  },
  toRound(val) {
    if (val < 10) {
      return '0' + val;
    }
    return val.toString();
  },
  md5(str) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
  },
  // 秒转化成 时分秒
  secondToTime(second) {
    const h = Math.floor(second / 3600);
    const m = Math.floor((second / 60) % 60);
    const s = Math.floor(second % 60);
    const result = h + '小时' + m + '分钟' + s + '秒';
    return result;
  },
  toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
  },
  randomStr(length) {
    const numbers = '0123456789';
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    const chars = numbers + letters;

    while (length > 0) {
      length--;
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  },
  getYearWeek(endDate) {
    let beginDate = new Date(endDate.getFullYear(), 0, 1);
    let endWeek = endDate.getDay();
    if (endWeek === 0) endWeek = 7;
    let beginWeek = beginDate.getDay();
    if (beginWeek === 0) beginWeek = 7;
    let millisDiff = endDate.getTime() - beginDate.getTime();
    let dayDiff = Math.floor((millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000);
    return Math.ceil(dayDiff / 7) + 1;
  }
};

module.exports = {
  ...util,
};