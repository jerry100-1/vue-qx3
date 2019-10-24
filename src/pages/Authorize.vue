<template>
  <div></div>
</template>

<script>
import mixin from '@/mixins'
import qs from 'qs'
import Util from '@/common/js/util'
import { mapGetters } from 'vuex'

export default {
  name: 'Authorize',
  mixins: [mixin],
  data () {
    return {
      searchJson: {}
    }
  },
  computed: {
    ...mapGetters({
      historyState: 'HistoryState'
    })
  },
  created () {
    this.init()
    window.addEventListener('popstate', this.init, false)
  },
  mounted () {
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.init)
  },
  methods: {
    async init(event) {
      if (!event && this.historyState.go) {
        window.history.go(this.historyState.go)
        return
      }
      // 如果本地存储了用户信息 赋值到store
      const userInfo = Util.getItem()
      if (userInfo && Object.keys(userInfo).length > 0) {
        await this.$store.dispatch('setUserInfo', userInfo)
      }

      const searchJson = Util.getSearchJson()
      this.searchJson = searchJson

      if (searchJson.force) {
        await this.$store.dispatch('setUserInfo', {})
        Util.removeItem()
      }

      if (this.userInfo.Auth) {
        this.goHome()
      } else if (searchJson.code) {
        this.onGotUserInfo(() => {
          window.history.go(-4)
        })
      } else if (searchJson.state !== 'STATE') {
        this.onGotUserInfo()
      } else {
        window.history.go(-2)
      }
    },
    goHome () {
      const searchJson = this.searchJson
      const redirect = searchJson.redirect ? decodeURIComponent(searchJson.redirect) : ''
      delete searchJson.code
      delete searchJson.state
      delete searchJson.force
      delete searchJson.redirect
      this.$set(this.searchJson, 'auth', this.userInfo.Auth)
      window.location.replace(`${this.config.get('LDUrl')}/main?${qs.stringify(this.searchJson)}#${redirect || `/home`}`)
    }
  }
}
</script>
