import ajax from "./ajax";
import Common from './common.js';

function initWechatConfig(wx, permission, callback) {
  if (!Common.isWeiXin) {
    return;
  }
  if (!obj) {
    var obj = {}
  }

  let location = window.location.href
  const index = location.indexOf('#')
  location = encodeURIComponent(location.substring(0, index > -1 ? index : location.length))

  ajax({
    url: Common.requestUrl('Fortune/Index/getWxConfig'),
    method: 'get',
    async: true,
    data: {
      url: location
    },
    success: function (data) {
      data = (typeof data == 'object') ? result : JSON.parse(data);
      if (data.Status === 200) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.Result.appId, // 必填，公众号的唯一标识
          timestamp: data.Result.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.Result.nonceStr, // 必填，生成签名的随机串
          signature: data.Result.signature,// 必填，签名，见附录1
          jsApiList: permission // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.error(function (res) {
          // alert(res.errMsg);
        });
        wx.ready(function () {
          if (typeof callback == 'function') {
            callback()
          }
          ;
        });
      }
    }
  })
}

function getLocation(wx, obj, callback) {
  if (!Common.isWeiXin) {
    return;
  }
  wx.getLocation({
    type: 'gcj02',
    success: res => {
      res.status = 200
      callback(res)
    }
  })
}

function openLocation(wx, obj) {
  if (!Common.isWeiXin) {
    return;
  }
  if (!obj) {
    var obj = {}
  }
  wx.openLocation(obj)
}

function shareConfig(wx, obj) {
  if (!Common.isWeiXin) {
    return;
  }

  wx.hideMenuItems({
    menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:QZone']
  })

  const sTitle = obj.sTitle || '';
  const sDesc = obj.sDesc || '';
  const sLink = obj.sLink || '';
  const sImgurl = obj.sImgurl || '';
  
  //监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareAppMessage({
    title: sTitle,
    desc: sDesc,
    link: sLink,
    imgUrl: sImgurl,
    type: obj.type || '', // 分享类型,music、video或link，不填默认为link
    dataUrl: obj.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
    trigger: function (res) {
      //alert('用户点击发送给朋友');
      if (typeof obj.trigger == 'function') {
        obj.trigger();
      }
    },
    success: function (res) {
      // alert('已分享');
      if (typeof obj.success == 'function') {
        obj.success();
      }
    },
    cancel: function (res) {
      //alert('已取消');
      if (typeof obj.cancel == 'function') {
        obj.cancel();
      }
    },
    fail: function (res) {
      // alert(JSON.stringify(res));
      if (typeof obj.fail == 'function') {
        obj.fail();
      }
    }
  });
  
  //监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareTimeline({
    title: sTitle,
    desc: sDesc,
    link: sLink,
    imgUrl: sImgurl,
    trigger: function (res) {
      //alert('用户点击分享到朋友圈');
      if (typeof obj.trigger == 'function') {
        obj.trigger();
      }
    },
    success: function (res) {
      //alert('已分享');
      if (typeof obj.success == 'function') {
        obj.success();
      }
    },
    cancel: function (res) {
      //alert('已取消');
      if (typeof obj.cancel == 'function') {
        obj.cancel();
      }
    },
    fail: function (res) {
      //alert(JSON.stringify(res));
      if (typeof obj.fail == 'function') {
        obj.fail();
      }
    }
  });
  
  //监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareQQ({
    title: sTitle,
    desc: sDesc,
    link: sLink,
    imgUrl: sImgurl,
    trigger: function (res) {
      //alert('用户点击分享到QQ');
      if (typeof obj.trigger == 'function') {
        obj.trigger();
      }
    },
    complete: function (res) {
      //alert(JSON.stringify(res));
    },
    success: function (res) {
      //alert('已分享');
      if (typeof obj.success == 'function') {
        obj.success();
      }
    },
    cancel: function (res) {
      //alert('已取消');
      if (typeof obj.cancel == 'function') {
        obj.cancel();
      }
    },
    fail: function (res) {
      //alert(JSON.stringify(res));
      if (typeof obj.fail == 'function') {
        obj.fail();
      }
    }
  });
  
  //监听“享到腾讯微博”按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareWeibo({
    title: sTitle, // 分享标题
    desc: sDesc, // 分享描述
    link: sLink, // 分享链接
    imgUrl: sImgurl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
      if (typeof obj.success == 'function') {
        obj.success();
      }
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
      if (typeof obj.cancel == 'function') {
        obj.cancel();
      }
    }
  });
  
  //监听“分享到QQ空间”按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareQZone({
    title: sTitle, // 分享标题
    desc: sDesc, // 分享描述
    link: sLink, // 分享链接
    imgUrl: sImgurl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
      if (typeof obj.success == 'function') {
        obj.success();
      }
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
      if (typeof obj.cancel == 'function') {
        obj.cancel();
      }
    }
  });
}

export default {
  initWechatConfig,
  shareConfig,
  getLocation,
  openLocation
}
