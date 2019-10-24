import Util from '../../common/js/util.js';
import config from '../../config/config.js';
import Common from '../../common/js/common.js';
import {Request} from "../../common/request";
import store from '@/vuex/index.js';
import Vue from 'vue'
import qs from 'qs'

function wxUrl(){
  const scope = (Util.getUrlParams('join') == 1) ? 'snsapi_base' : 'snsapi_userinfo'
  const searchJson = Util.getSearchJson()
  delete searchJson.code
  delete searchJson.state
  delete searchJson.force
  const searchJsonStr = qs.stringify(searchJson)
  const callbackUrl = window.location.origin + window.location.pathname + (searchJsonStr ? '?' + searchJsonStr : '') + window.location.hash
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.getters.Config.get('AppId') + '&redirect_uri=' + encodeURIComponent(callbackUrl) + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect'
  window.history.replaceState({}, null, callbackUrl)
  window.history.pushState({ go: -1 }, null, callbackUrl)
  window.history.pushState({ go: -3 }, null, callbackUrl)
  window.history.pushState({ go: -4 }, null, callbackUrl)
  window.location.href = url
}

function getWxCode(){
  if ( Common.isWeiXin ) {         //如果是微信
    var weixin_code = Util.getUrlParams('code');
    if ( !weixin_code ) {
      wxUrl();
    }else{
      return weixin_code;
    }
  }
}

// 获取字典
const getDicInfoByKey = obj => Request('Common/Common/getDicInfoByKey', 'GET', obj)

// 获取用户信息
const getUserInfo = obj => Request('Fortune/User/getInfo', 'GET', obj)

// 分享配置
const fetchShareConfig = obj => Request('Fortune/Index/fetchShareConfig', 'GET', obj)

// 获取域名配置
const getConfig = obj => Request('Fortune/Index/getConfig', 'GET', obj)

export default{
  wxLogin(){
    return new Promise((res, rej) => {
      var wxCode = getWxCode()
      if ( !wxCode ) { return rej(false) }

      const searchJson = Util.getSearchJson()
      Vue.$vux.loading.show({
        text: '正在登录'
      })
      Request('Fortune/User/login', 'POST', {
        code: wxCode,
        invitekey: searchJson.invitekey || ''
      }).then(data => {
        Vue.$vux.loading.hide()
        if (data.Status === 200) {
          const userInfo = data.Result instanceof Array ? data.Result[0] : data.Result
          Util.setItem({ Auth: userInfo.unionid })
          store.dispatch('setUserInfo', { Auth: userInfo.unionid })
          res(true)
        } else {
          if (data.Status === 202) {
            Util.removeItem()
            let search = window.location.search
            const index = search.indexOf('?')
            index === 0 && (search = search.substring(1))
            const searchJson = qs.parse(search)
            delete searchJson.code
            delete searchJson.state
            window.location.replace(window.location.origin + window.location.pathname + '?' + qs.stringify(searchJson) + '#/authorize')
            return
          }
          Vue.$vux.toast.show({
            type: 'text',
            text: '授权登录失败'
          })
        }
      }).catch(() => {
        Vue.$vux.loading.hide()
      })
    })
  },
  getDicInfoByKey,
  getUserInfo,
  fetchShareConfig,
  getConfig
}
