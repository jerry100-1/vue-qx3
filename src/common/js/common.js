import config from '../../config/config.js';
import Util from '../js/util.js'
import md5 from './md5.js'

const Common ={
	isAndroid : (function(){ return /(Android)/i.test(navigator.userAgent); })(),
  isIOS : (function(){ return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent); })(),
  isWeiXin : (function() { var ua = window.navigator.userAgent.toLowerCase(); var result = ua.match(/MicroMessenger/i) == 'micromessenger' ? true : false; return result })(),
  isWeibo : (function () { return /(weibo)/i.test(navigator.userAgent.toLowerCase()) })(),
  isPhone6p : (function(){
    var h=window.innerHeight,w=window.innerWidth,useragent = navigator.userAgent.toLowerCase(),isP6p = false;
    if(useragent.match(/mobile/i)!==null && useragent.match(/iphone/i)!==null && ( h>w ? (Math.abs(w-414)<10 && h<=736) : (Math.abs(w-736)<10) && h<=414)) isP6p = true;
    return isP6p;
  })(),
  requestUrl : function(name){            //请求的url
    if (!name) { console.log('未传入调用方法'); return; }
    var hash = md5( config.appkey + config.version + name + config.appid + config.deviceid + config.channel + Util.formatDate.timestamp() );
    var url = config.hosts + config.version + '/' +name + '?appid='+config.appid + '&channel='+ config.channel + '&time='+Util.formatDate.timestamp() + '&deviceid='+config.deviceid + '&hash='+hash;

    return url;
  },
	transformRequest: [
    function(data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) +
          '=' +
          encodeURIComponent(data[it]) +
          '&'
      }
      return ret
    }
	],
	// 表单提交数据封装
	formAjax(fnName,formData,auth){
		let self = this;
		let p = new Promise(function(res, rej){
      var xhr = new XMLHttpRequest();
      xhr.open("POST", Common.requestUrl(fnName));
      if ( auth ) { xhr.setRequestHeader('auth', auth);}
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            let data = xhr.responseText;
            data = typeof data == 'object' ? data : JSON.parse(data);
            res(self.resManage(data,true));
          }
        }
      };
	    });
	    return p;
	},
	// 统一处理返回值处理
	resManage(res,b){			//此处 b 参数是为了区别 图片上传（ formAjax 方法）
		let status = b ? res.Status : res.data.Status;
		let data = b ? res : res.data;
    
    return Util.JsonParse(data);
	},
  // 页面滑动到底部执行
  scroll(callback){
    window.onscroll = () => {
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      var Height = document.documentElement.offsetHeight || document.documentElement.clientHeight || document.body.offsetHeight
      let bottomOfWindow = Height - scrollTop - window.innerHeight <= 0
      if (bottomOfWindow) {
        callback && callback()
      }
    }
  },
  // 上传图片 返回图片base64
  uploadImg(event,callback){
    var reader = new FileReader();
    var imgFile;
    reader.onload=function(e) {
      imgFile = e.target.result;
      callback && callback(imgFile)
    };
    reader.readAsDataURL(event.target.files[0]);
  }
};

export default Common;
