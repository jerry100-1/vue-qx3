<template>
  <div class="container">
    <div class="head">
      你可以：
    </div>
    <div class="hor" @click="toComplaintResult">
      <div class="item-container">
        提交给微信团队审核
      </div>
      <img src="../../assets/images/icon_next@2x.png">
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import { ComplaintApi } from '@/api'

export default {
  name: 'ComplaintDetail',
  mixins: [mixin],
  methods: {
    toComplaintResult() {
      this.$vux.loading.show()
      ComplaintApi.complaint({
        type: this.$route.query.id,
        unionid: this.userInfo.UnionId,
        uid: this.userInfo.UserId
      }).then(data => {
        this.$vux.loading.hide()
        if (data.Status === 200) {
          console.log('hhh---,complaint:', data)
          this.$router.push('/complaintResult')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .head {
    color: #999999;
    margin: 0.5rem 0rem 0.1rem 0.3rem;
  }

  .hor {
    padding-right: 0.5rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    display: flex;
    background: white;
    vertical-align: center;

    .item-container {
      font-size: 0.36rem;
      margin-left: 0.3rem;
    }

    img {
      margin-right: 0.3rem;
      position: absolute;
      right: 0;
      align-self: center;
      width: 0.2rem;
      height: 0.35rem;
    }
  }
}
</style>
