<template>
  <div class="container">
    <div v-if="couponList.length > 0" class="coupon-list-wrapper">
      <div v-if="mode === 'select'" class="use-no-coupon-wrapper">
        <label class="use-no-coupon">
          <input v-model="useNoCoupon" @change="dontUseCoupon" @click="back" class="checkbox" autocomplete="off" type="radio" :value="true">
          <img class="checkbox-icon normal" src="../assets/images/checkbox-normal@2x.png" alt="">
          <img class="checkbox-icon checked" src="../assets/images/checkbox-checked@2x.png" alt="">
          <div class="text">不使用优惠券</div>
        </label>
      </div>
      <div class="coupon-list">
        <div
          v-for="item in couponList"
          :key="item.id"
          v-if="mode!='select'||item.status === 1"
          class="coupon"
          :class="{
            usable: +item.status === 1,
            used: +item.status === 2,
            expired: +item.status === 3,
            selected: selectedCoupon === item.id
          }">
          <div class="left">
            <div class="price-wrapper">
              <div class="free">免单</div>
              <!-- <div class="price">
                <span class="symbol">¥</span>
                <span class="price-num">30</span>
              </div> -->
            </div>
            <div class="desc">任一测算免费</div>
          </div>
          <div class="right">
            <div class="name">推送福利-全额免单券</div>
            <div class="condition">使用条件：平台任一测算</div>
            <div class="time">使用时间：{{ item.start | dateFormat }}-{{ item.end | dateFormat }}</div>
          </div>
          <button v-if="+item.status === 1" @click="useCoupon(item.id)" class="btn-use" type="button"></button>
        </div>
      </div>
    </div>
    <data-empty
      v-else
      empty-text="暂无优惠券"
      :show-button="false"
    ></data-empty>
  </div>
</template>

<script>
import mixin from '@/mixins'
import DataEmpty from '@/components/DataEmpty'
import { CouponApi } from '@/api'
import moment from 'moment'

export default {
  name: 'Coupon',
  mixins: [mixin],
  components: {
    DataEmpty
  },
  filters: {
    dateFormat: function (value) {
      if (!value) return ''
      const m = moment(value)
      if (m.isSame(moment(), 'year')) {
        return m.format('MM/DD')
      } else {
        return moment(value).format('YY/MM/DD')
      }
    }
  },
  data() {
    return {
      mode: null,
      useNoCoupon: false,
      selectedCoupon: null,
      couponList: []
    }
  },
  created() {
    const { query } = this.$route
    this.mode = query.mode
    if (query.mode === 'select') {
      document.title = '选择优惠券'
      if (query.storekey) {
        const couponId = window.localStorage.getItem(query.storekey)
        if (+couponId === 0) {
          this.useNoCoupon = true
          this.selectedCoupon = null
        } else if (!isNaN(couponId)) {
          this.useNoCoupon = false
          this.selectedCoupon = couponId
        }
      }
    } else {
      document.title = '我的优惠券'
    }
    this.getCoupon()
  },
  mounted() {
  },
  methods: {
    getCoupon() {
      this.$vux.loading.show()
      CouponApi.getCoupon({ unionid: this.userInfo.UnionId }).then(data => {
        this.$vux.loading.hide()
        if (data.Status !== 200) {
          this.$vux.toast.show({
            type: 'text',
            text: data.Result.ErrorMsg
          })
          return
        }
        this.couponList = data.Result.data instanceof Array ? data.Result.data : []
      }).catch(() => {
        this.$vux.loading.hide()
      })
    },
    back() {
      if (this.useNoCoupon) {
        window.history.go(-1)
      }
    },
    dontUseCoupon() {
      if (this.useNoCoupon) {
        this.selectedCoupon = null
      }
      const { query } = this.$route
      if (query.storekey) {
        window.localStorage.setItem(query.storekey, 0)
        window.history.go(-1)
      }
    },
    useCoupon(id) {
      this.useNoCoupon = false
      this.selectedCoupon = id

      const { query } = this.$route
      if (query.mode === 'select' && query.storekey) {
        window.localStorage.setItem(query.storekey, id)
        window.history.go(-1)
      } else {
        this.$router.push('/home')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .coupon-list-wrapper {
    min-height: 100vh;
    background: #F2F2F2;
    .use-no-coupon-wrapper {
      display: flex;
      padding: 0.4rem 0.24rem 0.16rem;
      background: #F2F2F2;
      .use-no-coupon {
        display: flex;
        align-items: center;
        .checkbox {
          display: none;
        }
        .checkbox-icon {
          width: 0.32rem;
          height: 0.32rem;
          margin-right: 0.16rem;
          &.normal {
            display: block;
          }
          &.checked {
            display: none;
          }
        }
        .checkbox:checked ~ .checkbox-icon {
          &.normal {
            display: none;
          }
          &.checked {
            display: block;
          }
        }
        .text {
          font-size: 0.32rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(62,62,62,1);
          line-height: 0.32rem;
        }
      }
    }

    .coupon-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.24rem 0;
      .coupon {
        position: relative;
        display: flex;
        width: 7.02rem;
        height: 2.28rem;
        &:not(:first-child) {
          margin-top: 0.24rem;
        }
        .left {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          width: 2.14rem;
          height: 100%;
          padding-bottom: 0.62rem;
          box-sizing: border-box;
          .price-wrapper {
            .free {
              font-size: 0.6rem;
              font-family: PingFang-SC-Bold;
              font-weight: bold;
              color: rgba(203,74,74,1);
              line-height: 0.6rem;
              margin-bottom: 0.2rem;
            }
            .price {
              display: flex;
              align-items: flex-end;
              .symbol {
                font-size: 0.4rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(203,74,74,1);
                line-height: 0.4rem;
                margin-right: 0.12rem;
                padding-bottom: 0.12rem;
              }
              .price-num {
                font-size: 0.8rem;
                font-family: DINAlternate-Bold;
                font-weight: bold;
                color: rgba(203,74,74,1);
                line-height: 0.92rem;
              }
            }
          }
          .desc {
            font-size: 0.24rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(51,51,51,1);
            line-height: 0.24rem;
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 4.06rem;
          height: 100%;
          padding: 0 0.28rem;
          box-sizing: border-box;
          .name {
            font-size: 0.28rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(102,102,102,1);
            line-height: 0.32rem;
          }
          .condition,
          .time {
            font-size: 0.24rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(153,153,153,1);
            line-height: 0.24rem;
          }
          .condition {
            margin-top: 0.28rem;
          }
          .time {
            margin-top: 0.24rem;
          }
        }

        .btn-use {
          position: absolute;
          top: 0;
          right: 0;
          width: 0.8rem;
          height: 2.28rem;
          background: none;
          border: none;
          outline: none;
        }

        &.usable {
          background: url('../assets/images/coupon-bg-1@2x.png') no-repeat;
          background-size: 100% 100%;
          &.selected {
            background: url('../assets/images/coupon-bg-1-checked@2x.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        &.used {
          background: url('../assets/images/coupon-bg-2@2x.png') no-repeat;
          background-size: 100% 100%;
        }
        &.expired {
          background: url('../assets/images/coupon-bg-3@2x.png') no-repeat;
          background-size: 100% 100%;

          .left {
            .price-wrapper {
              .free {
                color: #999999;
              }
              .price {
                .symbol {
                  color: #999999;
                }
                .price-num {
                  color: #999999;
                }
              }
            }
            .desc {
              color: #BDBDBD;
            }
          }
        }
      }
    }
  }
}
</style>
