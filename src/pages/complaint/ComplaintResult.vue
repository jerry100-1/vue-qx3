<template>
  <div class="container">
    <div class="check"></div>
    <div class="title">
      投诉已提交
    </div>
    <div class="content">
      微信团队会尽快核实，并通过“微信团队”通知你审核结果。感谢你的支持。
    </div>
    <div class="bt-close" @click="close">
      关闭
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'

export default {
  name: 'ComplaintResult',
  mixins: [mixin],
  methods: {
    close() {
      this.$router.go(-3)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding-top: 1.2rem;
  text-align: center;
  width: 100vw;
  height: 100vh;
  background: white;

  .check {
    position: relative;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: #04be02;
    border-radius: 1rem;
  }

  .check::after {
    content: "";
    position: absolute;
    left: 0.25rem;
    top: 0.28rem;
    width: 42%;
    height: 20%;
    border: 0.08rem solid white;
    border-top: none;
    border-right: none;
    background: transparent;
    transform: rotate(-50deg);
  }

  .title {
    font-weight: 800;
    margin-top: 0.8rem;
    font-size: 0.36rem;
  }

  .content {
    line-height: 0.44rem;
    padding-left: 0.95rem;
    padding-right: 0.95rem;
    margin-top: 0.5rem;
    font-size: 0.3rem;
  }

  .bt-close {
    margin: 1rem auto auto;
    width: 2.8rem;
    line-height: 0.6rem;
    color: white;
    background: #04be02;
    border-radius: 0.04rem;
  }
}
</style>
