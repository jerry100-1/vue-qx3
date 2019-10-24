<template>
  <div class="home-container">
    <div :style="style">
      <div v-if="bannerList.length > 0" class="banner-wrapper">
        <swiper
          ref="bannerSwiper"
          class="banner-swiper"
          :height="defaultSwiperHeight"
          dots-position="center"
          dots-class="swiper-dots"
          :show-dots="bannerList.length > 1"
          :show-desc-mask="false"
          :interval="5000"
          :duration="1000"
          :auto="true"
          :loop="true"
          >
          <swiper-item class="swiper-item" v-for="(item, index) in bannerList" :key="index">
            <a :href="item.Url || 'javascript:;'" class="swiper-img">
              <img :src="item.Img" alt="">
            </a>
          </swiper-item>
        </swiper>
        <swiper
          class="history-test-swiper"
          direction="vertical"
          :height="historyTestSwiperHeight"
          :style="{'line-height': historyTestSwiperHeight}"
          :show-dots="false"
          :show-desc-mask="false"
          :interval="3000"
          :duration="500"
          :auto="true"
          :loop="true"
          >
          <swiper-item class="swiper-item" v-for="(item, index) in historyTestList" :key="index">
            <div class="history-test-wrapper">
              <div class="history-test">
                <img :src="item.Img" class="avatar" alt="">
                <div class="test-detail">{{ `${item.Nick}测了${item.Product},${item.Time}` }}</div>
              </div>
            </div>
          </swiper-item>
        </swiper>
      </div>
      <div v-if="appList.length > 0" class="primary">
        <a v-for="(item, index) in appList" :key="index" :href="item.Url || 'javascript:;'" class="item">
          <img :src="item.Img" alt="">
        </a>
      </div>
      <div class="secondary">
        <template v-if="hotProductList.length > 0">
          <div class="category">热门测算</div>
          <div class="list">
            <a v-for="(item, index) in hotProductList" :key="index" :href="item.Url" class="item">
              <img :src="item.Img" class="img" alt="">
              <div class="item-detail">
                <div class="item-text-wrapper">
                  <div class="item-title">{{ item.Name }}</div>
                  <div class="item-desc">{{ item.Desc }}</div>
                </div>
                <div class="item-link-wrapper">
                  <div class="item-count">{{ item.Total + '人' }}<span class="suffix">已测</span></div>
                  <div class="count-link-separator"></div>
                  <div class="item-link">
                    <div class="link-text">去测算</div>
                    <div class="link-icon"></div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </template>
        <template v-for="category in productCategory" v-if="productListMap.get(category.id) && productListMap.get(category.id).length > 0">
          <div :key="`category${category.id}`" class="category">{{ category.name }}</div>
          <div :key="`list${category.id}`" class="list">
            <a v-for="(item, index) in productListMap.get(category.id)" :key="index" :href="item.Url" class="item">
              <img :src="item.Img" class="img" alt="">
              <div class="item-detail">
                <div class="item-text-wrapper">
                  <div class="item-title">{{ item.Name }}</div>
                  <div class="item-desc">{{ item.Desc }}</div>
                </div>
                <div class="item-link-wrapper">
                  <div class="item-count">{{ item.Total + '人' }}<span class="suffix">已测</span></div>
                  <div class="count-link-separator"></div>
                  <div class="item-link">
                    <div class="link-text">去测算</div>
                    <div class="link-icon"></div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </template>
      </div>
    </div>
    <!-- 投诉悬浮块 -->
    <complaint v-if="!userInfo.ComplaintJumpUrl"></complaint>

    <div v-if="showTestDialog" @touchmove.prevent="" class="test-dialog-mask">
      <div class="test-dialog">
        <div class="content">
          <img class="bg" :src="product.Img" alt="">
          <div class="info">
            <div class="title">{{ product.Name }}</div>
            <div class="desc">{{ product.Desc }}</div>
            <div class="test-count">
              <span class="num">{{ product.Total }}人</span>已测
            </div>
          </div>
        </div>
        <div @click="test(product.Url)" class="button">
          <span class="text">去测算</span>
          <img class="icon" src="../assets/images/icon-arrow-right-white@2x.png" alt="">
        </div>
        <img @click="closeTestDialog" class="close" src="../assets/images/icon-close-dialog@2x.png" alt="">
      </div>
    </div>

  </div>
</template>

<script>
import mixin from '@/mixins'
import Util from '@/common/js/util'
import qs from 'qs'
import { Swiper, SwiperItem } from 'vux'
import { HomeApi } from '@/api'
import Complaint from '@/components/Complaint'
import WechatUtil from '@/common/js/wechatUtil'

export default {
  name: 'Home',
  mixins: [mixin],
  components: {
    Swiper,
    SwiperItem,
    Complaint
  },
  data () {
    return {
      searchJson: {},
      style: {
      },

      bannerList: [],
      historyTestList: [],

      defaultSwiperHeight: Util.remToPx(2.72) + 'px',
      historyTestSwiperHeight: parseInt(Util.remToPx(0.64)) + 'px',

      appList: [],

      showTestDialog: false,

      productCategory: [
        {
          id: 5,
          name: '恋爱婚姻'
        }, {
          id: 6,
          name: '事业财富'
        }, {
          id: 7,
          name: '流年运势'
        // }, {
        //   id: 8,
        //   name: '祈愿'
        }
      ],
      productListMap: new Map(),

      hotProductList: [],

      eidMap: new Map(),
      pidMap: new Map(),

      product: {}
    }
  },
  computed: {
  },
  watch: {
  },
  async created() {
    const searchJson = Util.getSearchJson()
    const app = searchJson.app
    const pid = searchJson.productid
    const params = searchJson.params

    this.getFortuneIndexData()
    await this.fetchAllProductList()

    if (pid) {
      const product = this.pidMap.get(pid + '')
      if (product) {
        this.product = product
        this.showTestDialog = true
      }
    } else if (app) {
      const testCount = Math.round(parseInt(window.localStorage.getItem('testCount') || 1723) + 100 * Math.random())
      window.localStorage.setItem('testCount', testCount)
      if (app === 'ai') {
        const product = {
          Img: require('../assets/images/bg-ai@2x.png'),
          Name: 'AI看相',
          Desc: '人工智能结合传统面相手相',
          Total: testCount >= 10000 ? (testCount / 10000).toFixed(2) + '万' : testCount,
          Url: '/app/./index.php?i=2&c=entry&eid=57',
        }
        if (params) {
          const paramJson = qs.parse(decodeURIComponent(params))
          const index = product.Url.indexOf('?')
          if (index > 0) {
            const urlWithoutParam = product.Url.substring(0, index)
            const oldParamJson = qs.parse(product.Url.substring(index + 1))
            const newParamJson = { ...oldParamJson, ...paramJson }
            product.Url = urlWithoutParam + '?' + qs.stringify(newParamJson)
          } else {
            product.Url = product.Url + '?' + qs.stringify(paramJson)
          }
        }
        this.product = product
        this.showTestDialog = true
      } else if (app === 'taluo') {
        const product = {
          Img: require('../assets/images/bg-taluo@2x.png'),
          Name: '塔罗占卜',
          Desc: '圣三角牌阵解读过去现在未来',
          Total: testCount >= 10000 ? (testCount / 10000).toFixed(2) + '万' : testCount,
          Url: '/app/index.php?i=2&c=entry&do=index&m=zunyue_taluopai',
        }
        if (params) {
          const paramJson = qs.parse(decodeURIComponent(params))
          const index = product.Url.indexOf('?')
          if (index > 0) {
            const urlWithoutParam = product.Url.substring(0, index)
            const oldParamJson = qs.parse(product.Url.substring(index + 1))
            const newParamJson = { ...oldParamJson, ...paramJson }
            product.Url = urlWithoutParam + '?' + qs.stringify(newParamJson)
          } else {
            product.Url = product.Url + '?' + qs.stringify(paramJson)
          }
        }
        this.product = product
        this.showTestDialog = true
      }
    }
    this.fetchDialogOrder()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    getFortuneIndexData() {
      HomeApi.getFortuneIndexData().then(data => {
        if (data.Status === 200) {
          const list = data.Result.Images instanceof Array ? data.Result.Images : []
          this.bannerList = list.filter(item => +item.Position === 1)
          this.appList = list.filter(item => +item.Position === 2)
          this.historyTestList = data.Result.Users instanceof Array ? data.Result.Users : []
          if (this.bannerList.length > 0) {
            const img = new Image()
            img.onload = () => {
              this.$nextTick(() => {
                const swiper = this.$refs.bannerSwiper
                if (swiper) {
                  swiper.xheight = window.innerWidth / (img.width / img.height) + 'px'
                }
              })
            }
            img.src = this.bannerList[0].Img
          }
        }
      })
    },
    fetchAllProductList() {
      return Promise.all([
        this.fetchHotProductList(),
        ...this.productCategory.map(item => {
          return this.fetchProductList(item.id)
        })
      ])
    },
    fetchHotProductList() {
      return new Promise((resolve, reject) => {
        HomeApi.fetchProductList({
          hot: 1,
          offset: 0,
          limit: 100
        }).then(data => {
          if (data.Status === 200) {
            this.hotProductList = data.Result.List
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    fetchProductList(categoryId) {
      return new Promise((resolve, reject) => {
        HomeApi.fetchProductList({
          class: categoryId,
          hot: 0,
          offset: 0,
          limit: 100
        }).then(data => {
          if (data.Status === 200) {
            const list = data.Result.List
            list.forEach(item => {
              let url = item.Url
              const index = url.indexOf('?')
              if (index >= 0) {
                url = url.substring(index + 1)
                const params = qs.parse(url)
                this.pidMap = new Map([...this.pidMap, [params.product_id + '', item]])
              }
            })
            this.productListMap = new Map([...this.productListMap, [categoryId, list]])
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    fetchDialogOrder() {
      HomeApi.fetchDialogOrder()
    },
    removeParams() {
      const searchJson = Util.getSearchJson()
      delete searchJson.app
      delete searchJson.productid
      delete searchJson.params
      window.history.replaceState({}, null, window.location.origin + window.location.pathname + '?' + qs.stringify(searchJson) + window.location.hash)
    },
    test(url) {
      this.removeParams()
      window.location.href = url
    },
    closeTestDialog() {
      this.removeParams()
      WechatUtil.initWechatConfig(this.$wechat, [
        'scanQRCode',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideAllNonBaseMenuItem',
        'hideMenuItems'
      ], this.fetchShareConfig())
      this.showTestDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  min-height: 100vh;
  padding-bottom: 1rem;
  background: #F8F4F1;
  .banner-wrapper {
    position: relative;
    .banner-swiper {
      /deep/ .swiper-dots {
        display: flex;
        align-items: center;
        bottom: 0.20rem;
        a {
          float: none;
          margin-left: 0;
          &:not(:first-child) {
            margin-left: 0.08rem;
          }
          .vux-icon-dot {
            display: block;
            width: 0.08rem;
            height: 0.08rem;
            background: rgba(255,255,255,0.8);
            border-radius: 0.04rem;
            &.active {
              background: rgba(0,0,0,0.6);
            }
          }
        }
      }
      .swiper-img {
        display: block;
        width: 100%;
        height: 100%;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .history-test-swiper {
      position: absolute;
      bottom: 0.5rem;
      left: 0;
      z-index: 10;
      width: 70%;
      // height: 0.64rem;
      pointer-events: none;
      .history-test-wrapper {
        display: flex;
        height: 100%;
      }
      .history-test {
        display: flex;
        align-items: center;
        height: 100%;
        padding-right: 0.16rem;
        box-sizing: border-box;
        background: rgba(0,0,0,0.4);
        border-radius: 0 2rem 2rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .avatar {
          flex-shrink: 0;
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          margin-left: 0.16rem;
          border-radius: 50%;
        }
        .test-detail {
          font-size: 0.24rem;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(255,255,255,1);
          height: 100%;
          margin-left: 0.12rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .primary {
    display: flex;
    padding: 0.32rem;
    background: #FFFBF8;
    overflow-x: auto;
    &:after {
      flex-shrink: 0;
      content: '';
      display: block;
      width: 0.3rem;
      height: 0.01rem;
    }
    .item {
      flex-shrink: 0;
      width: 3.28rem;
      height: 1.92rem;
      &:not(:first-child) {
        margin-left: 0.3rem;
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .secondary {
    padding: 0 0.32rem 0.24rem;
    margin-top: 0.18rem;
    background: #FFFBF8;
    overflow: hidden;
    .category {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 4rem;
      height: 0.34rem;
      background: url('../assets/images/bg-category.png') no-repeat;
      background-size: 100% 100%;
      font-size: 0.34rem;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(51,51,51,1);
      line-height: 0.34rem;
      margin: 0.36rem auto 0.32rem;
    }
    .list {
      .item {
        position: relative;
        display: block;
        overflow: hidden;
        &:not(:first-child) {
          margin-top: 0.32rem;
        }
        .img {
          display: block;
          width: 100%;
        }
        .item-detail {
          position: absolute;
          top: 0;
          right: 0.16rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 3.56rem;
          height: 100%;
          padding: 0.24rem 0 0.2rem;
          box-sizing: border-box;
          .item-text-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            .item-title {
              font-size: 0.4rem;
              font-family: PingFang-SC-Bold;
              font-weight: bold;
              color: rgba(51,51,51,1);
              line-height: 0.56rem;
            }
            .item-desc {
              font-size: 0.26rem;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(0,0,0,0.67);
              line-height: 0.36rem;
              margin-top: 4px;
              text-align: center;
              max-height: 0.72rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-word;
            }
          }
          .item-link-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            .item-count {
              font-size: 0.26rem;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(161,61,53,1);
              line-height: 0.36rem;
              .suffix {
                color: #666666;
              }
            }
            .count-link-separator {
              width: 0.02rem;
              height: 0.32rem;
              margin: 0 0.26rem 0 0.22rem;
              background: #979797;
            }
            .item-link {
              display: flex;
              align-items: center;
              width: 1.36rem;
              height: 0.48rem;
              border: 0.02rem solid rgba(161,61,53,1);
              .link-text {
                font-size: 0.26rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(161,61,53,1);
                line-height: 0.36rem;
                margin-left: 0.18rem;
              }
              .link-icon {
                display: block;
                width: 0.14rem;
                height: 0.24rem;
                background: url('../assets/images/angle-right-dark-red.png') no-repeat;
                background-size: 100% 100%;
                margin-left: 0.12rem;
              }
            }
          }
        }
      }
    }
  }

  .test-dialog-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    .test-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6.86rem;
      .content {
        position: relative;
        display: flex;
        justify-content: flex-end;
        height: 2.4rem;
        border-radius: 0.08rem 0.08rem 0 0;
        background: rgba(219,222,213,1);
        overflow: hidden;
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .info {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 3.26rem;
          padding-top: 0.48rem;
          margin-right: 0.6rem;
          .title {
            font-size: 0.44rem;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            color: rgba(51,51,51,1);
            line-height: 0.44rem;
          }
          .desc {
            font-size: 0.3rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(0,0,0,0.67);
            line-height: 0.42rem;
            margin-top: 0.16rem;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .test-count {
            font-size: 0.26rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #666666;
            line-height: 0.26rem;
            margin-top: 0.28rem;
            .num {
              color: rgba(161,61,53,1);
            }
          }
        }
      }
      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1rem;
        background: linear-gradient(141deg,rgba(235,94,94,1) 0%,rgba(181,57,57,1) 100%);
        border-radius: 0 0 0.08rem 0.08rem;
        .text {
          font-size: 0.36rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(255,255,255,1);
          line-height: 0.36rem;
        }
        .icon {
          display: block;
          width: 0.16rem;
          height: 0.3rem;
          margin-left: 0.14rem;
        }
      }
      .close {
        position: absolute;
        top: 0.16rem;
        right: 0.18rem;
        display: block;
        width: 0.26rem;
        height: 0.26rem;
      }
    } 
  }
}
</style>
