<template>
  <div class="container">
    <img class="recruit" :src="img">
    <div class="btn-wrapper">
      <router-link to="/recruit-info" class="apply">申请入驻</router-link>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import { GlobalApi } from '@/api'

export default {
  name: 'Recruit',
  mixins: [mixin],
  data() {
    return {
      img: null
    }
  },
  created() {
    this.getImg()
  },
  mounted() {
  },
  methods: {
    getImg() {
      GlobalApi.getDicInfoByKey({ key: 'masterImg' }).then(data => {
        if (data.Status === 200) {
          if (data.Result instanceof Array && data.Result.length > 0) {
            this.img = data.Result[0].value
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  // padding-bottom: 1.16rem;
  // box-sizing: border-box;
  // background: rgba(161,61,53,1);
  .recruit {
    display: block;
    width: 100%;
    // height: 38.10rem;
    // margin-top: -1.28rem;
  }
  .btn-wrapper {
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 1.24rem;
    padding: 0 0.16rem;
    box-sizing: border-box;
    background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.44) 100%);
    .apply {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 0.92rem;
      background: linear-gradient(146deg,rgba(250,232,168,1) 0%,rgba(201,171,107,1) 100%);
      background-clip: padding-box;
      border-radius: 0.08rem;
      border: 1px solid rgba(5,5,5,0.03);
      font-size: 0.34rem;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(107,76,21,1);
      line-height: 0.48rem;
    }
  }
}
</style>
