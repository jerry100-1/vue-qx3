<template>
  <div class="ys-float-btn" :class="{ show: isMounted }" :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FloatImgBtn',
  props: {
    zIndex: {
      type: Number,
      default: 1000
    },
    boundaryTop: {
      type: Number,
      default: 0
    },
    boundaryBottom: {
      type: Number,
      default: 0
    },
    boundaryLeft: {
      type: Number,
      default: 0
    },
    boundaryRight: {
      type: Number,
      default: 0
    },
    initLeft: {
      type: Number,
      default: null
    },
    initTop: {
      type: Number,
      default: null
    },
    gapWidth: {
      type: Number,
      default: 10
    },
    coefficientHeight: {
      type: Number,
      default: 0.6
    }
  },
  mounted() {
    const el = this.$el
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
    this.itemWidth = el.clientWidth
    this.itemHeight = el.clientHeight
    this.left = this.initLeft || this.clientWidth - this.itemWidth - this.gapWidth
    this.top = this.initTop || this.clientHeight * this.coefficientHeight
    this.style = {
      transform: `translate3d(${this.left}px, ${this.top}px, 0)`,
      'z-index': this.zIndex
    }
    this.isMounted = true

    window.addEventListener('scroll', this.handleScrollStart)
    
    el.addEventListener('touchstart', () => {
      el.style.transition = 'none'
    })
    el.addEventListener('touchmove', (e) => {
      if (e.targetTouches.length === 1) {
        let touch = event.targetTouches[0]
        let touchX = touch.clientX
        let touchY = touch.clientY
        if (touchX < this.boundaryLeft + this.itemWidth / 2) {
          touchX = this.boundaryLeft + this.itemWidth / 2
        } else if (touchX > this.clientWidth - this.boundaryRight - this.itemWidth / 2) {
          touchX = this.clientWidth - this.boundaryRight - this.itemWidth / 2
        }
        if (touchY < this.boundaryTop + this.itemHeight / 2) {
          touchY = this.boundaryTop + this.itemHeight / 2
        } else if (touchY > this.clientHeight - this.boundaryBottom - this.itemHeight / 2) {
          touchY = this.clientHeight - this.boundaryBottom - this.itemHeight / 2
        }

        this.left = touchX - this.itemWidth / 2
        this.top = touchY - this.itemHeight / 2
        this.style = {
          transform: `translate3d(${this.left}px, ${this.top}px, 0)`,
          'z-index': this.zIndex
        }
      }
    })
    el.addEventListener('touchend', () => {
      el.style.transition = 'all 0.3s'
      if (this.left > this.clientWidth / 2) {
        this.left = this.clientWidth - this.itemWidth - this.gapWidth - this.boundaryRight
      } else {
        this.left = this.gapWidth + this.boundaryLeft
      }
      this.style = {
        transform: `translate3d(${this.left}px, ${this.top}px, 0)`,
        'z-index': this.zIndex
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScrollStart)
  },
  methods: {
    onBtnClicked() {
      this.$emit('onFloatBtnClicked')
    },
    handleScrollStart() {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleScrollEnd()
      }, 300)
      this.currentTop = document.documentElement.scrollTop || document.body.scrollTop
      if (this.left > this.clientWidth / 2) {
        this.left = this.clientWidth - this.itemWidth / 2
      } else {
        this.left = -this.itemWidth / 2
      }
    },
    handleScrollEnd() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop === this.currentTop) {
        if (this.left > this.clientWidth / 2) {
          this.left = this.clientWidth - this.itemWidth - this.gapWidth - this.boundaryRight
        } else {
          this.left = this.gapWidth + this.boundaryLeft
        }
        clearTimeout(this.timer)
      }
    }
  },
  data() {
    return {
      timer: null,
      currentTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      itemWidth: 0,
      itemHeight: 0,
      left: 0,
      top: 0,
      style: {},
      isMounted: false
    }
  }
}
</script>

<style lang="less" scoped>
.ys-float-btn {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  visibility: hidden;
  &.show {
    visibility: visible;
  }
}
</style>
