import { GlobalApi } from '@/api'
import { mapGetters } from 'vuex';
import { TransferDomDirective as TransferDom } from 'vux'
import WechatUtil from '@/common/js/wechatUtil'
import qs from 'qs'

const mixin = {
  directives: {
    TransferDom
  },
  computed: {
    ...mapGetters({
      config: 'Config',
      userInfo: 'UserInfo'
    })
  },
  data() {
    return {
    }
  },
  created() {
    document.title = this.$route.meta.title || ''      // 设置页面title
  },
  mounted() {
    if (this.$route.name !== 'Authorize' && this.userInfo.UnionId) {
      this.fetchShareConfig()
    }
  },
  beforeDestroy() {
    this.$vux.loading.hide()
  },
  methods: {
    // 登录
    onGotUserInfo(callback) {
      if (!this.userInfo.Auth) {
        GlobalApi.wxLogin().then(data => {
          if (data && callback) {
            callback()
          }
        })
      }
    },
    fetchShareConfig() {
      const shareLogo = new Image()
      shareLogo.src = require('../assets/images/share-logo@2x.png')

      GlobalApi.fetchShareConfig({
        unionid: this.userInfo.UnionId,
        type: 2
      }).then(data => {
        if (data.Status === 200) {
          const shareList = data.Result instanceof Array ? data.Result : typeof data.Result === 'object' ? [data.Result] : []
          const share = shareList[Math.min(Math.floor(shareList.length * Math.random()), shareList.length - 1)]
          if (share) {
            const searchJson = {}
            const invitekey = this.userInfo.InviteKey
            invitekey && (searchJson.invitekey = invitekey)
            const searchJsonStr = qs.stringify(searchJson)
            const self = this
            self.$wechat.ready(function () {
              WechatUtil.shareConfig(self.$wechat, {
                sTitle: share.Title,
                sDesc: share.Desc,
                sLink: `${self.config.get('ShareUrl')}/main${searchJsonStr ? '?' + searchJsonStr : ''}#/home`,
                sImgurl: share.Img || shareLogo.src
              })
            })
          }
        }
      })
    }
  }
}

export default mixin