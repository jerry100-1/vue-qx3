<template>
  <div class="container">
    <div class="user-info-bg">
      <div class="user-info">
        <img class="user-avatar" :src="userInfo.Avatar || require('../assets/images/my-avatar@2x.png')" alt="">
        <div class="user-text">
          <div class="nick-name">{{ userInfo.NickName }}</div>
          <div v-if="userInfo.Mobile" class="user-mobile">{{ userInfo.Mobile }}</div>
        </div>
      </div>
    </div>
    <div class="my-test-report">
      <div class="title">我的测算报告</div>
      <div class="app-list">
        <router-link to="/bazi-report" class="app">
          <img class="app-icon" src="../assets/images/icon-bazi@2x.png" alt="">
          <div class="app-name">八字测算</div>
        </router-link>
        <a href="/app/index.php?i=2&c=entry&do=myreport&m=hc_face" class="app">
          <img class="app-icon" src="../assets/images/icon-ai@2x.png" alt="">
          <div class="app-name">AI看相</div>
        </a>
        <router-link to="/tarot-report" class="app">
          <img class="app-icon" src="../assets/images/icon-taluo@2x.png" alt="">
          <div class="app-name">塔罗占卜</div>
        </router-link>
      </div>
    </div>
    <div class="menu-list">
      <router-link to="/archive" class="item">
        <div class="item-info">
          <img class="icon" src="../assets/images/icon-archive@2x.png" alt="">
          <div class="name">档案管理</div>
        </div>
        <div class="entry">
          <img class="icon" src="../assets/images/icon-angle-right@2x.png" alt="">
        </div>
      </router-link>
      <router-link v-if="userInfo.Coupon instanceof Array && userInfo.Coupon.length > 0" to="/coupon" class="item">
        <div class="item-info">
          <img class="icon" src="../assets/images/icon-coupon@2x.png" alt="">
          <div class="name">我的优惠券</div>
        </div>
        <div class="entry">
          <div class="text">{{ userInfo.Coupon instanceof Array ? userInfo.Coupon.filter(item => +item.status === 1).length : '' }}</div>
          <img class="icon" src="../assets/images/icon-angle-right@2x.png" alt="">
        </div>
      </router-link>
    </div>
    <div class="menu-list">
      <router-link to="/recruit" class="item">
        <div class="item-info">
          <img class="icon" src="../assets/images/icon-coop@2x.png" alt="">
          <div class="name">大师招募</div>
        </div>
        <div class="entry">
          <img class="icon" src="../assets/images/icon-angle-right@2x.png" alt="">
        </div>
      </router-link>
      <a href="https://support.qq.com/products/76099?" class="item">
        <div class="item-info">
          <img class="icon" src="../assets/images/icon-suggest@2x.png" alt="">
          <div class="name">意见反馈</div>
        </div>
        <div class="entry">
          <img class="icon" src="../assets/images/icon-angle-right@2x.png" alt="">
        </div>
      </a>
      <a :href="productConfigMap.get('QAUrl') ? productConfigMap.get('QAUrl') : 'javascript:;'" class="item">
        <div class="item-info">
          <img class="icon" src="../assets/images/icon-contact@2x.png" alt="">
          <div class="name">联系客服</div>
        </div>
        <div class="entry">
          <img class="icon" src="../assets/images/icon-angle-right@2x.png" alt="">
        </div>
      </a>
      <div @click="showFollowDialog = true" class="item">
        <div class="item-info">
          <img class="icon" src="../assets/images/icon-follow@2x.png" alt="">
          <div class="name">关注公众号</div>
        </div>
        <div class="entry">
          <div class="text">测测运势</div>
          <img class="icon" src="../assets/images/icon-angle-right@2x.png" alt="">
        </div>
      </div>
    </div>

    <!-- 投诉悬浮块 -->
    <complaint v-if="!userInfo.ComplaintJumpUrl"></complaint>

    <div v-show="showFollowDialog" @touchmove.prevent="" class="follow-dialog-mask">
      <div class="follow-dialog-wrapper">
        <div class="follow-dialog">
          <div class="title">关注测测运势公众号</div>
          <div class="content">关注“<span class="account">测测运势</span>”公众号<br>更多<span class="highlight">专业测算、优惠活动</span>等你来~</div>
          <div class="qrcode-wrapper">
            <img class="qrcode" :src="productConfigMap.get('followGzhImg')" alt="">
          </div>
          <img class="tip" src="../assets/images/tip-longpress@2x.png" alt="">
        </div>
        <img @click="showFollowDialog = false" class="close" src="../assets/images/close-dialog@2x.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import Complaint from '@/components/Complaint'
import { GlobalApi } from '@/api'

export default {
  name: 'My',
  mixins: [mixin],
  components: {
    Complaint
  },
  data() {
    return {
      productConfig: [],
      showFollowDialog: false
    }
  },
  computed: {
    productConfigMap() {
      return new Map([...this.productConfig.map(item => [item.key, item.value])])
    }
  },
  created() {
    this.getProductConfig()
  },
  methods: {
    getProductConfig() {
      GlobalApi.getDicInfoByKey({ key: 'productConfig' }).then(data => {
        if (data.Status === 200) {
          this.productConfig = data.Result instanceof Array ? data.Result : []
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  padding-bottom: 1.42rem;
  background: rgba(242,242,242,1);
  .user-info-bg {
    height: 2.9rem;
    padding: 0.5rem 0.64rem 0;
    box-sizing: border-box;
    background: url('../assets/images/my-bg@2x.png') no-repeat;
    background-size: 100% 100%;
    .user-info {
      display: flex;
      align-items: center;
      .user-avatar {
        display: block;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        margin-right: 0.2rem;
      }
      .user-text {
        .nick-name {
          font-size: 0.34rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(255,255,255,1);
          line-height: 0.34rem;
        }
        .user-mobile {
          font-size: 0.3rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(79,1,1,1);
          line-height: 0.3rem;
          margin-top: 0.24rem;
        }
      }
    }
  }

  .my-test-report {
    width: 7.1rem;
    height: 2.6rem;
    padding: 0.32rem 0.44rem 0.34rem;
    box-sizing: border-box;
    background: rgba(255,255,255,1);
    margin: -0.9rem auto 0;
    .title {
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51,51,51,1);
      line-height: 0.3rem;
    }
    .app-list {
      display: flex;
      justify-content: space-between;
      padding: 0 0.38rem;
      box-sizing: border-box;
      margin-top: 0.24rem;
      .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        .app-icon {
          display: block;
          width: 1.06rem;
          height: 1.06rem;
        }
        .app-name {
          font-size: 0.24rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(102,102,102,1);
          line-height: 0.24rem;
          margin-top: 0.1rem;
        }
      }
    }
  }

  .menu-list {
    width: 7.1rem;
    margin: 0.2rem auto 0;
    background: rgba(0,0,0,0.08);
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.2rem;
      padding: 0 0.32rem;
      background: rgba(255,255,255,1);
      &:not(:first-child) {
        margin-top: 0.02rem;
      }
      .item-info {
        display: flex;
        align-items: center;
        .icon {
          display: block;
          width: 0.44rem;
          height: 0.44rem;
          margin-right: 0.12rem;
        }
        .name {
          font-size: 0.3rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(51,51,51,1);
          line-height: 0.42rem;
        }
      }
      .entry {
        display: flex;
        align-items: center;
        .text {
          font-size: 0.3rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(203,74,74,1);
          line-height: 0.3rem;
          margin-right: 0.16rem;
        }
        .icon {
          display: block;
          width: 0.22rem;
          height: 0.36rem;
        }
      }
    }
  }

  .follow-dialog-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    .follow-dialog-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      .follow-dialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 6.26rem;
        padding: 0.32rem;
        box-sizing: border-box;
        background: rgba(255,255,255,1);
        border-radius: 0.08rem;
        .title {
          display: flex;
          align-items: center;
          font-size: 0.4rem;
          font-family: PingFangSC;
          font-weight: 500;
          color: rgba(133,144,152,1);
          line-height: 0.56rem;
          &::before,
          &::after {
            content: '';
            display: block;
            width: 0.22rem;
            height: 0.02rem;
            background: #859098;
            margin: 0 0.14rem;
          }
        }
        .content {
          font-size: 0.28rem;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(84,91,99,1);
          line-height: 0.4rem;
          margin-top: 0.48rem;
          text-align: center;
          .account {
            font-family: PingFangSC-Medium;
            color: #2A2D2F;
          }
          .highlight {
            color: #EE3C3C;
          }
        }
        .qrcode-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.96rem;
          height: 2.96rem;
          padding: 0.1rem;
          box-sizing: border-box;
          border-radius: 0.08rem;
          border: 0.02rem solid rgba(133,144,152,1);
          margin-top: 0.52rem;
          .qrcode {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .tip {
          display: block;
          width: 2.92rem;
          height: 1rem;
          margin-top: 0.32rem;
        }
      }
      .close {
        display: block;
        width: 0.64rem;
        height: 0.64rem;
        margin-top: 0.64rem;
      }
    }
  }
}
</style>
