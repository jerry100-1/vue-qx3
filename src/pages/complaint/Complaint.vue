<template>
  <div class="container">
    <div class="head">
      请选择投诉该网页的原因：
    </div>
    <div v-for="(item, index) in complaintList" :key="index">
      <div class="hor" @click="toComplaintDetail(item.key)">
        <div class="item-container">
          {{item.value}}
        </div>
        <img src="../../assets/images/icon_next@2x.png">
      </div>
      <div class="hor-line"/>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import { ComplaintApi } from '@/api'

export default {
  name: 'Complaint',
  mixins: [mixin],
  data() {
    return {
      complaintList: []
    }
  },
  created() {
    this.$vux.loading.show()
    ComplaintApi.getComplaintList({ key: 'complaintsList' }).then(data => {
      this.$vux.loading.hide()
      if (data.Status === 200) {
        console.log('hhh---,complaint:', data)
        this.complaintList = data.Result
      }
    })
  },
  methods: {
    toComplaintDetail(key) {
      this.$router.push({path: 'complaintDetail', query: {id: key}})
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .head {
    color: #999999;
    margin: 0.5rem 0rem 0.1rem 0.3rem;
  }

  .hor {
    padding-right: 0.5rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    display: flex;
    background: white;
    vertical-align: center;

    .item-container {
      font-size: 0.36rem;
      margin-left: 0.3rem;
    }

    img {
      margin-right: 0.3rem;
      position: absolute;
      right: 0;
      align-self: center;
      width: 0.2rem;
      height: 0.35rem;
    }
  }

  .hor-line {
    margin-left: 0.5rem;
    height: 1px;
    background: #f0f0f0;
  }
}
</style>
