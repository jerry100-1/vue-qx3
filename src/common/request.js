import Util from './js/util'
import axios from 'axios';
import Common from "./js/common"
import Config from '../config/config.js'
import Vue from 'vue'
import store from '@/vuex/index'
import qs from 'qs'

function Request(url = '', method = 'GET', params = {}) {
  return new Promise((res, rej) => {
    return axios({
      method: method,
      url: Common.requestUrl(url, method.toLowerCase() === 'get' ? params : ''),
      params: method.toLowerCase() === 'get' ? params : '',
      data: method.toLowerCase() === 'post' ? params : '',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Auth': Util.getSearchJson().auth || store.getters.UserInfo.Auth || ''
      },
      transformRequest: Common.transformRequest
    }).then(r => {
      if(r.data.Status === 254 || r.data.Status === 551){
        Util.removeItem()
        const searchJson = Util.getSearchJson()
        delete searchJson.code
        delete searchJson.state
        delete searchJson.auth
        const hash = window.location.hash
        if (hash.indexOf('#/authorize') === 0) {
          window.location.replace(window.location.origin + window.location.pathname + '?' + qs.stringify(searchJson) + hash)
          return
        }
        if (hash.indexOf('#') === 0) {
          searchJson.redirect = encodeURIComponent(hash.substring(1))
        }
        searchJson.force = true
        window.location.replace(`${store.getters.Config.get('AuthUrl')}/main?${qs.stringify(searchJson)}#/authorize`)
        return
      }
      res(r.data)
    }).catch(error => {
      Vue.$vux.toast.show({
        type: 'text',
        text: error.message
      })
      rej(error)
    })
  })
}

function UploadRequest(url, formData) {
  return new Promise((res, rej) => {
    return axios.post(Common.requestUrl(url), formData, {
      headers: {
        'Auth': Util.getSearchJson().auth || store.getters.UserInfo.Auth || '',
        'content-type': 'multipart/form-data'
      }
    }).then(r => {
      if(r.data.Status === 254 || r.data.Status === 551){
        Util.removeItem()
        const searchJson = Util.getSearchJson()
        delete searchJson.code
        delete searchJson.state
        delete searchJson.auth
        const hash = window.location.hash
        if (hash.indexOf('#/authorize') === 0) {
          window.location.replace(window.location.origin + window.location.pathname + '?' + qs.stringify(searchJson) + hash)
          return
        }
        if (hash.indexOf('#') === 0) {
          searchJson.redirect = encodeURIComponent(hash.substring(1))
        }
        searchJson.force = true
        window.location.replace(`${store.getters.Config.get('AuthUrl')}/main?${qs.stringify(searchJson)}#/authorize`)
        return
      }
      res(r.data)
    }).catch(e => {
      res({ Status: 201, Result: { ErrorMsg: '上传失败！' } })
    })
  })
}

export {
  Request,
  UploadRequest
}