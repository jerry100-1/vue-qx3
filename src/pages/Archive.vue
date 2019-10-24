<template>
  <div class="container">
    <div v-if="archiveList.length > 0" class="archive-list-wrapper">
      <div class="archive-list">
        <div v-for="item in archiveList" :key="item.id" @click="selectArchive(item)" class="archive">
          <div class="gender-icon male" :class="{ male: +item.gender === 1, female: +item.gender === 2 }"></div>
          <div class="right">
            <div class="right-top">
              <div class="nickname">{{ item.realname }}</div>
              <div @click.stop="" class="btns">
                <div @click="editArchive(item)" class="btn-edit">
                  <img class="icon" src="../assets/images/icon-edit@2x.png" alt="">
                  <div class="text">编辑</div>
                </div>
                <div @click="confirmRemove(item.id)" class="btn-remove">
                  <img class="icon" src="../assets/images/icon-remove@2x.png" alt="">
                  <div class="text">删除</div>
                </div>
              </div>
            </div>
            <div class="right-bottom">{{ item.other_birthday ? item.other_birthday.replace('农历:', '农历') : formatDate(item.birthday) }} {{ birthtimeMap.get(item.birthtime) }}</div>
          </div>
        </div>
      </div>

      <div class="btn-add-mask">
        <div @click="addArchive" class="btn-add">新增档案</div>
      </div>

      <div v-show="showRemoveDialog" @touchmove.prevent="" class="remove-dialog-mask">
        <div class="remove-dialog">
          <div class="head">
            <img class="icon" src="../assets/images/icon-tip@2x.png" alt="">
            <div class="title">删除档案</div>
          </div>
          <div class="content">删除档案后将无法恢复，请确认是否删除</div>
          <div class="foot">
            <div @click="remove" class="btn-confirm">确认</div>
            <div @click="cancelRemove" class="btn-cancel">取消</div>
          </div>
        </div>
      </div>

    </div>
    <data-empty
      v-else
      @buttonClick="addArchive"
      empty-text="暂无档案信息"
      button-text="新增档案"
    ></data-empty>
  </div>
</template>

<script>
import mixin from '@/mixins'
import DataEmpty from '@/components/DataEmpty'
import { ArchiveApi } from '@/api'
import moment from 'moment'

export default {
  name: 'Archive',
  mixins: [mixin],
  components: {
    DataEmpty
  },
  data() {
    return {
      birthtimeData: [
        {
          name: '未知',
          value: '99'
        }, {
          name: '早子时(00:00-00:59)',
          value: '00'
        }, {
          name: '丑时(01:00-02:59)',
          value: '01'
        }, {
          name: '寅时(03:00-04:59)',
          value: '03'
        }, {
          name: '卯时(05:00-06:59)',
          value: '05'
        }, {
          name: '辰时(07:00-08:59)',
          value: '07'
        }, {
          name: '巳时(09:00-10:59)',
          value: '09'
        }, {
          name: '午时(11:00-12:59)',
          value: '11'
        }, {
          name: '未时(13:00-14:59)',
          value: '13'
        }, {
          name: '申时(15:00-16:59)',
          value: '15'
        }, {
          name: '酉时(17:00-18:59)',
          value: '17'
        }, {
          name: '戌时(19:00-20:59)',
          value: '19'
        }, {
          name: '亥时(21:00-22:59)',
          value: '21'
        }, {
          name: '晚子时(23:00-23:59)',
          value: '23'
        }
      ],
      archiveList: [],
      showRemoveDialog: false,
      id: null,
    }
  },
  computed: {
    birthtimeMap() {
      return new Map([...this.birthtimeData.map(item => [item.value, item.name])])
    }
  },
  created() {
    this.getUserRecord()
  },
  methods: {
    formatDate(value) {
      return moment(value, ['YYYY-MM-DD', 'YYYY-M-D']).format('公历YYYY年M月D日')
    },
    getUserRecord() {
      ArchiveApi.getUserRecord({
        unionid: this.userInfo.UnionId
      }).then(data => {
        if (data.Status !== 200) {
          this.$vux.toast.show({
            type: 'text',
            text: data.Result.ErrorMsg
          })
          return
        }
        this.archiveList = data.Result.data instanceof Array ? data.Result.data : []
      })
    },
    addArchive() {
      this.$router.push('/edit-archive')
    },
    editArchive(item) {
      this.$router.push({
        path: '/edit-archive',
        query: {
          id: item.id,
          name: encodeURIComponent(item.realname),
          gender: item.gender,
          birthday: item.birthday,
          birthtime: item.birthtime,
          other_birthday: item.other_birthday ? encodeURIComponent(item.other_birthday) : '',
          other_birthtime: item.other_birthtime
        }
      })
    },
    confirmRemove(id) {
      this.id = id
      this.showRemoveDialog = true
    },
    remove() {
      this.showRemoveDialog = false
      this.$vux.loading.show()
      ArchiveApi.delRecord({
        id: this.id
      }).then(data => {
        this.$vux.loading.hide()
        if (data.Status !== 200) {
          this.$vux.toast.show({
            type: 'text',
            text: data.Result.ErrorMsg
          })
          return
        }
        const index = this.archiveList.findIndex(item => item.id === this.id)
        if (index > -1) {
          this.archiveList.splice(index, 1)
        }
        this.$vux.toast.show({
          type: 'text',
          text: '已删除档案'
        })
      }).catch(() => {
        this.$vux.loading.hide()
      })
    },
    cancelRemove() {
      this.showRemoveDialog = false
    },
    selectArchive(item) {
      const { query } = this.$route
      if (query.mode === 'select' && query.storekey) {
        window.localStorage.setItem(query.storekey, JSON.stringify(item))
        window.history.go(-1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .archive-list-wrapper {
    min-height: 100vh;
    padding-bottom: 1.48rem;
    background: #F2F2F2;
    .archive-list {
      .archive {
        display: flex;
        align-items: center;
        padding: 0.48rem 0.24rem;
        background: #FFFFFF;
        &:not(:first-child) {
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .gender-icon {
          flex-shrink: 0;
          width: 0.88rem;
          height: 0.88rem;
          margin-right: 0.2rem;
          &.male {
            background: url('../assets/images/icon-gender-male@2x.png') no-repeat;
            background-size: 100% 100%;
          }
          &.female {
            background: url('../assets/images/icon-gender-female@2x.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .right {
          flex-grow: 1;
          .right-top {
            display: flex;
            justify-content: space-between;
            .nickname {
              font-size: 0.36rem;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(51,51,51,1);
              line-height: 0.36rem;
            }
            .btns {
              display: flex;
              align-items: center;
              .btn-edit {
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
              .btn-remove {
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
          }
          .right-bottom {
            font-size: 0.26rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(153,153,153,1);
            line-height: 0.26rem;
            margin-top: 0.28rem;
          }
        }
      }
    }

    .btn-add-mask {
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 1.48rem;
      background: #F2F2F2;
      .btn-add {
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
  }
}
</style>
