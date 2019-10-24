<template>
  <div class="data-empty">
    <img class="data-empty-img" src="../assets/images/data-empty@2x.png" alt="">
    <div class="data-empty-text">{{ emptyText }}</div>
    <div v-if="showButton" @click="handleButtonClick" class="data-empty-button">{{ buttonText }}</div>
  </div>
</template>

<script>
export default {
  name: 'DataEmpty',
  props: {
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    buttonText: {
      type: String,
      default: ''
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleButtonClick() {
      this.$emit('buttonClick')
    }
  }
}
</script>

<style lang="less" scoped>
.data-empty {
  width: 100vw;
  height: 100vh;
  padding-top: 2.66rem;
  box-sizing: border-box;
  background: #FFFFFF;
  .data-empty-img {
    display: block;
    width: 2.76rem;
    height: 1.84rem;
    margin: 0 auto;
  }
  .data-empty-text {
    font-size: 0.3rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153,153,153,1);
    line-height: 0.3rem;
    margin-top: 0.4rem;
    text-align: center;
  }
  .data-empty-button {
    position: fixed;
    bottom: 0.28rem;
    left: 50%;
    transform: translate(-50%, 0);
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
</style>
