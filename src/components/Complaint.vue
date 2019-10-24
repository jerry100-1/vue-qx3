<template>
  <div @click="go" class="back-top">投诉</div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
  		isTop: true,
  		show: false,
  		clientHeight: null
    }
  },

	methods: {
    go () {
      this.$router.push('/complaint')
    }
	}
}
</script>

<style lang="less" scoped>
.back-top {
  position: fixed;
  z-index: 1000;
  right: 0;
  bottom: 3.76rem;
  display: block;
  width: 0.4rem;
  height: 0.88rem;
  padding: 0.12rem 0.08rem;
  box-sizing: border-box;
  font-size: 0.24rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255,255,255,1);
  line-height: 0.32rem;
  background: rgba(0,0,0,0.4);
  border-radius: 0.12rem 0 0 0.12rem;
}
</style>
