<template>
  <div class="main-container">
    <keep-alive :include="[]">
      <router-view :key="$route.path"/>
    </keep-alive>
    <div v-if="$route.path !== '/'" class="main-tab-menu">
      <div v-for="(tab, index) in tabs" :key="index" @click="linkTo(tab.routeName)" class="tab" :class="{ active: $route.name === tab.routeName }">
        <img :src="$route.name === tab.routeName ? tab.activeIcon : tab.icon" class="icon" alt="">
        <div class="name">{{ tab.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'

export default {
  name: 'Index',
  mixins: [mixin],
  data () {
    return {
      tabs: [
        {
          name: '首页',
          routeName: 'Home',
          icon: require('../assets/images/icon-home@2x.png'),
          activeIcon: require('../assets/images/icon-home-active@2x.png')
        // }, {
        //   name: '日签',
        //   routeName: 'Riqian',
        //   icon: require('../assets/images/icon-riqian@2x.png'),
        //   activeIcon: require('../assets/images/icon-riqian-active@2x.png')
        }, {
          name: '我的',
          routeName: 'My',
          icon: require('../assets/images/icon-my@2x.png'),
          activeIcon: require('../assets/images/icon-my-active@2x.png')
        }
      ]
    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    linkTo(name) {
      const route = this.$router.match({ name })
      if (route.path === this.$route.path) return
      _hmt.push(['_trackEvent', "点击tab", name])
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  .main-tab-menu {
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    display: flex;
    border-top: 0.01rem solid rgba(0,0,0,0.1);
    background: #FFFFFF;
    background-size: 100% auto;
    .tab {
      flex-grow: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 0.14rem;
      .icon {
        display: block;
        width: 0.48rem;
        height: 0.48rem;
      }
      .name {
        font-size: 0.2rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(153,153,153,1);
        line-height: 0.2rem;
        margin-top: 0.02rem;
        max-width: 100%;
        // overflow: hidden;
        // text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.active {
        .name {
          color: rgba(190,65,65,1);
        }
      }
    }
  }
}
</style>
