<template>
  <div id="app" v-cloak>
    <keep-alive :include="[]">
      <router-view :key="$route.path"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import util from '@/common/js/util'
import WechatUtil from '@/common/js/wechatUtil'
import { GlobalApi } from '@/api'

export default {
  name: 'App',
  created() {
    if (this.$route.name !== 'Authorize') {
      this.initWxConfig()
    }
  },
  methods: {
    initWxConfig() {
      WechatUtil.initWechatConfig(this.$wechat, [
        'scanQRCode',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideAllNonBaseMenuItem',
        'hideMenuItems'
      ])
    }
  }
}
</script>

<style lang="less">
@import './assets/css/swiper-3.4.2.min.css';
@import "./assets/css/base.css";
</style>
