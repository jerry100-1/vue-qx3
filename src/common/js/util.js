import qs from 'qs'

var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding(s, len) {
  var len = len - (s + '').length;
  for (var i = 0; i < len; i++) { s = '0' + s; }
  return s;
};

function xssScript(s) {
  var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") //格式 RegExp("[在中间定义特殊过滤字符]")
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
};


export default {
  //获取url 参数
  getUrlParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return xssScript(unescape(r[2]));
    return null;
  },
  formatDate: {
    // 格式化日期
    format(date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, function($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length);
          case 'M':
            return padding(date.getMonth() + 1, $0.length);
          case 'd':
            return padding(date.getDate(), $0.length);
          case 'w':
            return date.getDay() + 1;
          case 'h':
            return padding(date.getHours(), $0.length);
          case 'm':
            return padding(date.getMinutes(), $0.length);
          case 's':
            return padding(date.getSeconds(), $0.length);
        }
      });
    },
    // 返回时间戳
    timestamp() {
      return Date.parse(new Date()) / 1000
    },
    // 返回n天前的日期
    formatDaysAgo(n, pattern) {
      var today = new Date()
      var days_ago_milliseconds = today.getTime() - 1000 * 60 * 60 * 24 * n
      var days_ago = new Date();
      days_ago.setTime(days_ago_milliseconds)
      return this.format(days_ago, pattern)
    }
  },
  //去掉前后空格
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
  },
  // 转JSON 对象
  JsonParse(str, name) {
    var self = this;
    if (!str) { throw "JsonParse方法中传入的参数不存在或为空"; return; }
    var data = typeof str == 'object' ? str : JSON.parse(str);
    if (data.Status == 551) {
      setTimeout(() => {
        if (name === 'factory') {
          self.removeItem('factoryUserInfo');
          window.location.href = '/agent/#/factory/login';
        } else {
          self.removeItem();
          window.location.href = '/agent/#/login';
        }
      }, 1000)
    }
    return data;
  },
  // 获取本地存储数据
  getItem(name = 'testHomeUserInfo') {
    return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : {};
  },
  //设置本地存储数据
  setItem(obj, name = 'testHomeUserInfo') {
    if (typeof obj != 'object') { throw "参数不是一个对象"; return; }
    localStorage.setItem(name, JSON.stringify(obj));
  },
  //移除本地数据
  removeItem(name = 'testHomeUserInfo') {
    localStorage.removeItem(name);
  },
  getSearchJson() {
    let search = window.location.search
    const index = search.indexOf('?')
    index === 0 && (search = search.substring(1))
    return qs.parse(search)
  },
  tofixed(value) {
    var string = Number(value).toFixed(2) + '';
    var arr = string.split('.');
    return `¥${arr[0]}.<small>${arr[1]}</small>`;
  },
  remToPx(remVal) {
    var html = document.getElementsByTagName("html")[0]
    var htmlUnitFontSize = window.getComputedStyle(html, null).getPropertyValue('font-size')
    htmlUnitFontSize = parseFloat(htmlUnitFontSize)
    return remVal * htmlUnitFontSize
  },
  debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function() {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp

      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }

    return function(...args) {
      context = this
      timestamp = +new Date()
      const callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }

      return result
    }
  },

  /**
   * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数
   * @param func 执行函数
   * @param wait 时间间隔
   * @param options 如果你想禁用第一次首先执行的话，传递{leading: false}，
   *                如果你想禁用最后一次执行的话，传递{trailing: false}
   * @returns {Function}
   */
  throttle(func, wait, options) {
    var context, args, result
    var timeout = null
    var previous = 0
    if (!options) options = {}
    var later = function() {
      previous = options.leading === false ? 0 : new Date().getTime()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
    return function() {
      var now = new Date().getTime()
      if (!previous && options.leading === false) previous = now
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  }
};
