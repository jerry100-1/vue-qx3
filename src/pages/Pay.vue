<template>
  <div>
    <iframe ref="myIframe" style="visibility: hidden;" :src="`${config.get('LDUrl')}/main#/pay-result`"></iframe>
  </div>
</template>

<script>
import mixin from '@/mixins'

export default {
  name: 'Pay',
  mixins: [mixin],
  data() {
    return {
      timer: null
    }
  },
  mounted() {
    this.pay()
  },
  beforeDestroy() {
    this.timer && clearInterval(timer)
  },
  methods: {
    pay() {
      this.$vux.loading.show({
        text: '支付中...'
      })
      if (window.WeixinJSBridge) {
        this.wxpay()
      } else {
        document.addEventListener('WeixinJSBridgeReady', this.wxpay, false)
      }
    },
    wxpay() {
      const { storekey, appId, timeStamp, nonceStr, package: _package, signType, paySign } = this.$route.query
      const self = this
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          'appId': appId,
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': _package,
          'signType': signType,
          'paySign': paySign
        },
        function(res) {
          window.WeixinJSBridge.log(res.err_msg)
          self.$refs.myIframe.contentWindow.postMessage({ storekey, res }, '*')
          self.timer = setInterval(() => {
            self.$refs.myIframe.contentWindow.postMessage({ storekey, res }, '*')
          }, 1000)
        }
      )
    }
  }
}
</script>
