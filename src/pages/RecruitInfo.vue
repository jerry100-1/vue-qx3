<template>
  <div class="container" :style="style">
    <div class="form-wrapper">
      <form @submit.prevent="() => {}">
        <div class="form-item">
          <div class="label">联系人</div>
          <div class="form-input-wrapper">
            <input @blur="scroll" :disabled="showModal" v-model.trim="name" type="text" />
          </div>
        </div>
        <div class="form-item" style="margin-top: .36rem;">
          <div class="label">联系电话</div>
          <div class="form-input-wrapper">
            <input @blur="scroll" :disabled="showModal" v-model.trim="phone" type="tel" :maxlength="11" />
          </div>
        </div>
        <div class="form-item" style="align-items: flex-start; margin-top: .82rem;">
          <div class="label">入驻类型</div>
          <div class="form-input-wrapper">
            <div class="select-group">
              <div @click="changeEnterType(item.value)" v-for="(item, index) in enterTypeOptions" :key="index" class="select-item" :class="{ 'selected': enterType === item.value }">
                <div class="name">{{ item.name }}</div>
                <img class="select-icon" src="../assets/images/icon-selected@2x.png">
              </div>
            </div>
          </div>
        </div>
        <div class="form-item" style="align-items: flex-start; margin-top: .64rem;">
          <div class="label" style="padding-top: .22rem;">代理资质</div>
          <div class="form-input-wrapper">
            <textarea @blur="scroll" :disabled="showModal" v-model.trim="agentNature" placeholder="简单描述您的从业知识、经验; 
例如:  为知名人士看相算命,  累积测算超1000人、
从事相关单位职位" />
          </div>
        </div>
        <div class="confirm-btn-wrapper">
          <button @click="confirmSubmit" :disabled="!allowSubmit || showModal" class="confirm-btn" :class="{ 'enabled': allowSubmit }" type="button">确认提交</button>
        </div>
      </form>
    </div>
    <div @touchmove.prevent="" v-show="showModal" class="modal-wrapper">
      <div class="mask"></div>
      <div class="modal">
        <div class="title">
          <img class="icon" src="../assets/images/icon-tip@2x.png" alt="">
          <div class="text">提示</div>
        </div>
        <div class="content">您的资料已经提交审核，若审核通过，<br>1-3个工作日内我们将与您联系!</div>
        <div @click="confirm" class="confirm-btn">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import { RecruitApi } from '@/api'

export default {
  name: 'RecruitInfo',
  mixins: [mixin],
  data () {
    return {
      name: null,
      phone: null,
      enterTypeOptions: [
        {
          name: '面相',
          value: 1
        }, {
          name: '手相',
          value: 2
        }, {
          name: '八字',
          value: 3
        }, {
          name: '风水',
          value: 4
        }, {
          name: '星座塔罗',
          value: 5
        }
      ],
      enterType: 1,
      agentNature: null,
      showModal: false,
      style: {}
    }
  },
  computed: {
    allowSubmit () {
      return this.name && this.phone && this.phone.length === 11 && this.enterType && this.agentNature
    }
  },
  watch: {
    showModal (val, oldVal) {
      if (val) {
        this.style = {
          position: 'fixed',
          top: -(document.body.scrollTop || document.documentElement.scrollTop) + 'px',
          left: 0
        }
      } else {
        this.style = {...this.style, position: 'static'}
        this.$nextTick(() => {
          window.scrollTo(0, -parseFloat(this.style.top))
        })
      }
    }
  },
  mounted () {

  },
  methods: {
    saveGreatMaster () {
      this.$vux.loading.show({
        text: '提交中'
      })
      const postData = {
        name: this.name,
        phone: this.phone,
        merit: this.enterType,
        advantage: this.agentNature
      }
      RecruitApi.saveGreatMaster(postData).then(data => {
        this.$vux.loading.hide()
        if (data.Status !== 200) {
          this.$vux.toast.show({
            type: 'text',
            text: data.Result.ErrorMsg
          })
          return
        }
        this.showModal = true
      })
    },
    changeEnterType (value) {
      if (this.showModal) return
      this.enterType = value
    },
    confirmSubmit () {
      this.saveGreatMaster()
    },
    confirm () {
      this.$router.go(-1)
    },
    scroll () {
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollTop
      }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background: rgba(238,238,238,1);
  overflow: hidden;
  &.prevent-touch-move {
    height: 100vh;
    overflow: hidden;
  }
  .form-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: .38rem .40rem 1.48rem;
    background: rgba(255,255,255,1);
    .form-item {
      display: flex;
      align-items: center;
      .label {
        flex-shrink: 0;
        width: 4.2em;
        font-size: .32rem;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        line-height: 1;
        text-align: justify;
        text-align-last: justify;
        color: rgba(153,153,153,1);
        white-space: nowrap;
      }
      .form-input-wrapper {
        flex-grow: 1;
        margin-left: .26rem;
        input {
          width: 5.16rem;
          height: .80rem;
          font-size: .32rem;
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;
          padding: 0 .30rem;
          background: rgba(242,242,242,1);
          color: rgba(51,51,51,1);
          box-sizing: border-box;
        }
        .select-group {
          display: flex;
          flex-direction: column;
          padding-left: .08rem;
          .select-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            &:not(:first-child) {
              margin-top: .62rem;
            }
            .name {
              font-size: .32rem;
              font-family: SourceHanSansCN-Regular;
              font-weight: 400;
              color: rgba(153,153,153,1);
              line-height: 1;
              margin-right: .20rem;
              word-break: break-word;
            }
            .select-icon {
              display: none;
              width: .32rem;
              height: .32rem;
            }
            .add-icon {
              display: block;
              width: .32rem;
              height: .32rem;
            }
            &.selected {
              .name {
                color: #333333;
              }
              .select-icon {
                display: block;
              }
              .add-icon {
                display: none;
              }
            }
          }
        }
        textarea {
          width: 5.16rem;
          height: 2.24rem;
          font-size: .32rem;
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;
          line-height: .40rem;
          padding: .24rem;
          color: rgba(51,51,51,1);
          background: rgba(242,242,242,1);
          box-sizing: border-box;
          resize: none;
        }
      }
    }
    .confirm-btn-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.60rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: .28rem;
      background: #FFFFFF;
      box-sizing: border-box;
      .confirm-btn {
        width: 6.94rem;
        height: 0.92rem;
        background: rgba(219,219,219,1);
        background-clip: padding-box;
        border-radius: 0.08rem;
        border: 1px solid rgba(5,5,5,0.03);
        font-size: 0.34rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(153,153,153,1);
        line-height: 0.48rem;
        margin: 0 auto;
        &.enabled {
          background: linear-gradient(146deg,rgba(250,232,168,1) 0%,rgba(201,171,107,1) 100%);
          background-clip: padding-box;
          border: 1px solid rgba(5,5,5,0.03);
          font-size: 0.34rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(107,76,21,1);
          line-height: 0.48rem;
        }
      }
    }
  }
  .modal-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.6);
    }
    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 6.24rem;
      height: 3.7rem;
      transform: translate(-50%, -50%);
      padding: .4rem .3rem .34rem;
      background: rgba(255,255,255,1);
      box-sizing: border-box;
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          margin-right: 0.16rem;
        }
        .text {
          font-size: 0.36rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(51,51,51,1);
          line-height: 0.36rem;
        }
      }
      .content {
        font-size: 0.28rem;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(102,102,102,1);
        line-height: 0.44rem;
        margin-top: 0.4rem;
        text-align: center;
      }
      .confirm-btn {
        display: inline-block;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(203,74,74,1);
        line-height: 0.32rem;
        margin-top: 0.96rem;
        text-align: center;
      }
    }
  }
  textarea::placeholder {
    font-size: .32rem;
    font-family: SourceHanSansCN-Regular;
    font-weight: 400;
    line-height: .40rem;
    color: rgba(189,189,189,1);
  }
}
</style>
