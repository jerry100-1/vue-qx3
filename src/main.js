import './assets/js/adapt.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import Common from './common/js/common.js'
import Util from './common/js/util.js'
import store from './vuex/index.js'
import qs from 'qs'

import htmlToPdf from '@/components/utils/htmlToPdf'
Vue.use(htmlToPdf)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import { AlertPlugin, DatetimePlugin, ConfirmPlugin, ToastPlugin, WechatPlugin, LoadingPlugin } from 'vux'
Vue.use(DatetimePlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(LoadingPlugin)

import IosSelect from 'iosselect'
import '../node_modules/iosselect/src/iosSelect.css'

import './assets/js/calendar2.min.js'
import './assets/css/calendar2.css'

Vue.config.productionTip = false

const whiteList = ['/', '/authorize', '/pay', '/pay-result']

router.beforeEach(async(to, from, next) => {
  await store.dispatch('getConfig')
  await store.dispatch('setHistoryState', window.history.state || {})
  const authUrl = store.getters.Config.get('AuthUrl')
  const ldUrl = store.getters.Config.get('LDUrl')
  const shareUrl = store.getters.Config.get('ShareUrl')
  // 分享链接的域名转换为落地域名
  if (shareUrl.indexOf(window.location.origin) === 0 && ldUrl !== shareUrl) {
    window.location.replace(window.location.href.replace(shareUrl, ldUrl))
    return
  }

  if (whiteList.includes(to.path)) {
    next()
  } else {
    const searchJson = Util.getSearchJson()
    if (!searchJson.auth) {
      const newSearchJson = {
        ...searchJson,
        redirect: encodeURIComponent(to.fullPath)
      }
      if (to.fullPath === window.location.hash.substring(1)) {
        window.location.replace(`${authUrl}/main?${qs.stringify(newSearchJson)}#/authorize`)
      } else {
        window.location.href = `${authUrl}/main?${qs.stringify(newSearchJson)}#/authorize`
      }
    } else {
      store.dispatch('getUserInfo').then(() => {
        const complaintJumpUrl = store.getters.UserInfo.ComplaintJumpUrl
        if (complaintJumpUrl) {
          window.location.replace(complaintJumpUrl)
          return
        }
        next()
      }).catch(() => {
        next(false)
      })
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  methods:{
    IosSelect
  },
  template: '<App/>'
})
