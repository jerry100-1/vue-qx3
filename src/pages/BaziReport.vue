<template>
  <div @touchmove.prevent="" class="container">
    <template>
      <div v-show="reportList.length > 0" class="scroll-wrapper" ref="scroll">
        <div class="scroll-content">
          <div class="report-list-wrapper">
            <div class="report-list">
              <div v-for="item in reportList" :key="item.Id" class="report">
                <a :href="item.Url" class="test-info-wrapper">
                  <img class="test-icon" :src="item.Img" alt="">
                  <div class="test-info">
                    <div class="test-name">{{ item.Title }}</div>
                    <div class="nick-name">{{ `${item.Name}${item.OtherName ? '&' + item.OtherName : ''}` }}</div>
                  </div>
                </a>
                <div class="operate-line">
                  <div class="operate">
                    <a :href="`/app/index.php?i=2&c=entry&do=product&m=zunyue_ysyccs&product_id=${item.ProductId}`" class="test-again">
                      <img class="icon" src="../assets/images/icon-file-new@2x.png" alt="">
                      <div class="text">再测一次</div>
                    </a>
                    <div @click="confirmRemove(item.Id)" class="remove">
                      <img class="icon" src="../assets/images/icon-remove@2x.png" alt="">
                      <div class="text">删除</div>
                    </div>
                  </div>
                  <div class="test-time">{{ item.CreateTime ? item.CreateTime.replace(/-/g, '/') : '' }}</div>
                </div>
              </div>
            </div>

            <div class="pullup-wrapper">
              <div v-if="isLoading" class="">
                <span class="pullup-txt">加载中...</span>
              </div>
              <template v-else>
                <div v-if="reportList.length > 0 && total > reportList.length" class="">
                  <span class="pullup-txt">上拉加载更多</span>
                </div>
                <div v-else class="">
                  <span class="pullup-txt">已经没有更多报告了~</span>
                </div>
              </template>
            </div>

          </div>
        </div>
      </div>

      <div v-show="reportList.length > 0" class="btn-test-mask">
        <div @click="test" class="btn-test">去测算</div>
      </div>

      <div v-show="showRemoveDialog" @touchmove.prevent="" class="remove-dialog-mask">
        <div class="remove-dialog">
          <div class="head">
            <img class="icon" src="../assets/images/icon-tip@2x.png" alt="">
            <div class="title">删除报告</div>
          </div>
          <div class="content">删除报告后将无法恢复，请确认是否删除</div>
          <div class="foot">
            <div @click="remove" class="btn-confirm">确认</div>
            <div @click="cancelRemove" class="btn-cancel">取消</div>
          </div>
        </div>
      </div>

    </template>
    <data-empty
      v-if="reportList.length === 0"
      @buttonClick="test"
      empty-text="暂无测算报告"
      button-text="立即测算"
    ></data-empty>
  </div>
</template>

<script>
import mixin from '@/mixins'
import DataEmpty from '@/components/DataEmpty'
import { BaziReportApi } from '@/api'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'
import ImagesLoaded from 'imagesloaded'

export default {
  name: 'BaziReport',
  mixins: [mixin],
  components: {
    DataEmpty
  },
  data() {
    return {
      // better-scroll滚动组件对象
      bs: null,
      isLoading: false,
      reportList: [],
      limit: 10,
      total: 0,
      imgDomain: '',
      showRemoveDialog: false,
      id: null
    }
  },
  created() {
  },
  mounted() {
    this.initBScroll()
    this.refreshList()
  },
  beforeDestroy () {
    this.bs && this.bs.destroy()
  },
  methods: {
    initBScroll() {
      BScroll.use(Pullup)
      BScroll.use(PullDown)
      this.bs = new BScroll(this.$refs.scroll, {
        scrollY: true, // 开启纵向滚动
        click: true, // 允许点击事件
        eventPassthrough: 'horizontal', // 保留横向的原生滚动
        bounce: { // 边缘回弹
          top: false,
          bottom: true
        },
        probeType: 3, // 实时派发 scroll 事件
        pullUpLoad: true, // 开启上拉加载
        pullDownRefresh: false // 开启下拉刷新
      })
      this.bs.on('pullingUp', this.loadMore)
    },
    async refreshList() {
      this.isLoading = true
      this.currentPage = 1
      this.reportList = []
      this.total = 0
      this.bs.finishPullUp()
      this.bs.closePullUp()
      this.$vux.loading.show()
      await this.fetchFortuneOrderList()
      this.$vux.loading.hide()
      if (this.total > this.reportList.length) {
        this.bs.openPullUp()
      }
      await this.$nextTick()
      this.bs.refresh()
      ImagesLoaded(this.$refs.scroll, () => {
        this.bs.refresh()
      })
      this.isLoading = false
    },
    async loadMore() {
      this.isLoading = true
      this.currentPage++
      await this.fetchFortuneOrderList()
      this.bs.finishPullUp()
      if (this.total <= this.reportList.length) {
        this.bs.closePullUp()
      }
      await this.$nextTick()
      this.bs.refresh()
      ImagesLoaded(this.$refs.scroll, () => {
        this.bs.refresh()
      })
      this.isLoading = false
    },
    fetchFortuneOrderList() {
      return new Promise((resolve, reject) => {
        BaziReportApi.fetchFortuneOrderList({
          unionid: this.userInfo.UnionId,
          offset: this.reportList.length,
          limit: this.limit
        }).then(data => {
          if (data.Status !== 200) {
            this.$vux.toast.show({
              type: 'text',
              text: data.Result.ErrorMsg
            })
            return resolve()
          }
          this.imgDomain = data.Result.Domain
          this.reportList.push(...(data.Result.List instanceof Array ? data.Result.List : []))
          this.total = parseInt(data.Result.Total) || 0
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },
    confirmRemove(id) {
      this.id = id
      this.showRemoveDialog = true
      this.bs.closePullUp()
    },
    remove() {
      this.showRemoveDialog = false
      this.$vux.loading.show()
      BaziReportApi.deleteFortuneOrder({
        unionid: this.userInfo.UnionId,
        id: this.id
      }).then(data => {
        this.$vux.loading.hide()
        if (data.Status !== 200) {
          this.$vux.toast.show({
            type: 'text',
            text: data.Result.ErrorMsg
          })
          this.bs.openPullUp()
          return
        }
        const index = this.reportList.findIndex(item => item.Id === this.id)
        if (index > -1) {
          this.reportList.splice(index, 1)
          this.total--
          this.$nextTick(() => {
            this.bs.refresh()
          })
        }
        this.bs.openPullUp()
        this.$vux.toast.show({
          type: 'text',
          text: '已删除报告'
        })
      }).catch(() => {
        this.$vux.loading.hide()
        this.bs.openPullUp()
      })
    },
    cancelRemove() {
      this.showRemoveDialog = false
      this.bs.openPullUp()
    },
    test() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #F2F2F2;
  .scroll-wrapper {
    height: 100vh;
    overflow: hidden;
  }
  .report-list-wrapper {
    min-height: 100vh;
    padding-bottom: 1.48rem;
    background: #F2F2F2;
    .report-list {
      background: #F8F8F8;
      .report {
        padding: 0.4rem;
        background: #FFFFFF;
        &:not(:first-child) {
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .test-info-wrapper {
          display: flex;
          .test-icon {
            display: block;
            width: 1.18rem;
            height: 1.18rem;
            border-radius: 0.12rem;
            margin-right: 0.2rem;
          }
          .test-info {
            .test-name {
              font-size: 0.32rem;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(51,51,51,1);
              line-height: 0.32rem;
              margin-top: 0.04rem;
            }
            .nick-name {
              font-size: 0.26rem;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(153,153,153,1);
              line-height: 0.26rem;
              margin-top: 0.32rem;
            }
          }
        }

        .operate-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.4rem;
          .operate {
            display: flex;
            align-items: center;
            .test-again {
              display: flex;
              align-items: center;
              .icon {
                display: block;
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.08rem;
              }
              .text {
                font-size: 0.28rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(102,102,102,1);
                line-height: 0.28rem;
              }
            }
            .remove {
              display: flex;
              align-items: center;
              margin-left: 0.4rem;
              .icon {
                display: block;
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.08rem;
              }
              .text {
                font-size: 0.28rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(153,153,153,1);
                line-height: 0.28rem;
              }
            }
          }
          .test-time {
            font-size: 0.26rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(153,153,153,1);
            line-height: 0.26rem;
          }
        }
      }
    }
  }

  .btn-test-mask {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 1.48rem;
    background: #F2F2F2;
    .btn-test {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 6.94rem;
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

  .remove-dialog-mask {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.65);
    .remove-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6.24rem;
      background: #FFFFFF;
      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.4rem;
        .icon {
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          margin-right: 0.16rem;
        }
        .title {
          font-size: 0.36rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(51,51,51,1);
          line-height: 0.36rem;
        }
      }
      .content {
        padding: 0 0.4rem 0.6rem;
        font-size: 0.28rem;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(102,102,102,1);
        line-height: 0.28rem;
        text-align: center;
      }
      .foot {
        display: flex;
        border-top: 1px solid rgba(0,0,0,0.08);
        height: 1.02rem;
        .btn-confirm {
          flex: 1 0 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          border-right: 1px solid rgba(0,0,0,0.08);
          font-size: 0.32rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(203,74,74,1);
          line-height: 0.32rem;
          &:hover {
            background: rgba(0,0,0,0.08);
          }
        }
        .btn-cancel {
          flex: 1 0 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(153,153,153,1);
          line-height: 0.32rem;
          &:hover {
            background: rgba(0,0,0,0.08);
          }
        }
      }
    }
  }

  .pullup-wrapper {
    font-size: 0.3rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    padding: 0.4rem;
    text-align: center;
    color: #999;
  }
}
</style>
