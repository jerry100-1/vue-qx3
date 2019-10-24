<template>
	<img v-show="show" @click="backTop" class="back-top" src="../assets/images/back-top@2x.png">
</template>

<script>
export default {
  data() {
    return {
  		show: false,
  		clientHeight: null
    }
  },
  mounted() {
  	this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
	  window.addEventListener('scroll', this.scroll, false)
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.scroll, false)
	},
	methods: {
		scroll() {
	    const osTop = document.documentElement.scrollTop || document.body.scrollTop
	    if (this.clientHeight && osTop >= this.clientHeight / 2) {
	      this.show = true
	    } else {
	      this.show = false
	    }
	  },
	  backTop() {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    }
	}
}
</script>

<style lang="less" scoped>
.back-top {
  position: fixed;
  z-index: 1000;
  right: 0.32rem;
  bottom: 2.66rem;
  display: block;
  width: 0.96rem;
  height: 0.96rem;
}
</style>
