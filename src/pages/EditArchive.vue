<template>
  <div class="container">
    <form @submit.prevent="save" action="">
      <div class="form">
        <div class="field">
          <div class="name">姓名</div>
          <input v-model.trim="name" maxlength="15" class="value" type="text" placeholder="请填写姓名或昵称">
        </div>
        <div class="field">
          <div class="name">性别</div>
          <div class="gender-group">
            <label class="gender-wrapper">
              <input v-model="gender" class="gender-checkbox" value="1" autocomplete="off" type="radio">
              <div class="gender-button">
                <img class="icon normal" src="../assets/images/icon-male@2x.png" alt="">
                <img class="icon checked" src="../assets/images/icon-male-active@2x.png" alt="">
                <div class="text">男</div>
              </div>
            </label>
            <label class="gender-wrapper">
              <input v-model="gender" class="gender-checkbox" value="2" autocomplete="off" type="radio">
              <div class="gender-button">
                <img class="icon normal" src="../assets/images/icon-female@2x.png" alt="">
                <img class="icon checked" src="../assets/images/icon-female-active@2x.png" alt="">
                <div class="text">女</div>
              </div>
            </label>
          </div>
        </div>
        <div class="field">
          <div class="name">出生日期</div>
          <input @input="birthday = $event.target.dataset.date" id="birthday-picker" class="value" data-input-id="birthday-picker-input" data-type="0" :data-date="birthday || '1990-01-01'" type="text" placeholder="请选择出生日期">
          <input type="hidden" id="birthday-picker-input" :value="birthday">
        </div>
        <div class="field">
          <div class="name">出生时辰</div>
          <popup-picker
            v-model="birthtime"
            :data="birthtimeData"
            title=""
            confirm-text="确认"
            :show-name="true"
            class="field-birthtime"
            placeholder="请选择出生时辰"
          ></popup-picker>
        </div>
      </div>      
    </form>
    <div @click="save" class="btn-save">确认保存</div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import { PopupPicker } from 'vux'
import moment from 'moment'
import DataEmpty from '@/components/DataEmpty'
import { ArchiveApi } from '@/api'

export default {
  name: 'EditArchive',
  mixins: [mixin],
  components: {
    PopupPicker,
    DataEmpty
  },
  data() {
    return {
      id: null,
      name: null,
      gender: '1',
      birthday: null, //'1990-03-26',
      birthtime: [],
      otherBirthday: null,
      otherBirthtime: [],

      birthtimeData: [
        [
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
        ]
      ]
    }
  },
  created() {
  },
  mounted() {
    const { id, name, gender, birthday, birthtime, other_birthday, other_birthtime } = this.$route.query
    this.id = id || null
    this.name = name ? decodeURIComponent(name) : null
    this.gender = gender || '1'
    this.birthday = birthday || null
    this.birthtime = birthtime ? [birthtime] : []
    this.otherBirthday = other_birthday ? decodeURIComponent(other_birthday) : null
    this.otherBirthtime = other_birthtime ? [other_birthtime] : []
    if (this.id) {
      document.title = '编辑档案'
    } else {
      document.title = '添加档案'
    }

    if (this.otherBirthday) {
      const birthdayPicker = document.querySelector('#birthday-picker')
      birthdayPicker.value = this.otherBirthday
      birthdayPicker.setAttribute('data-type', '1')
    } else if (this.birthday) {
      document.querySelector('#birthday-picker').value = `公历:${moment(this.birthday, ['YYYY-MM-DD', 'YYYY-M-D']).format('YYYY-M-D')}`
    }
    new lCalendar().init('#birthday-picker')
  },
  methods: {
    setBirthday(event) {
      this.birthday = event.target.dataset.date
    },
    save() {
      if (!this.name || !/^[\u4E00-\u9FA5]/.test(this.name)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请输入名字(必须是中文)'
        })
        return
      }
      if (!this.gender) {
        this.$vux.toast.show({
          type: 'text',
          text: '请选择性别'
        })
        return
      }
      if (!this.birthday) {
        this.$vux.toast.show({
          type: 'text',
          text: '请选择出生日期'
        })
        return
      }
      if (this.birthtime.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: '请选择出生时辰'
        })
        return
      }
      const postData = {
        unionid: this.userInfo.UnionId,
        realname: this.name,
        gender: this.gender,
        birthday: this.birthday,
        birthtime: this.birthtime[0],
        other_birthtime: this.birthtime[0]
      }
      const otherBirthday = document.querySelector('#birthday-picker').value
      if (otherBirthday.indexOf('农历') === 0) {
        postData.other_birthday = otherBirthday
      }
      let method = 'addRecord'
      if (this.id) {
        method = 'updateRecord'
        postData.id = this.id
      }

      this.$vux.loading.show()
      ArchiveApi[method](postData).then(data => {
        this.$vux.loading.hide()
        if (data.Status !== 200) {
          this.$vux.toast.show({
            type: 'text',
            text: data.Result.ErrorMsg
          })
          return
        }
        this.$vux.toast.show({
          type: 'text',
          text: '保存档案成功'
        })
        this.$router.back()
      }).catch(() => {
        this.$vux.loading.hide()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  padding-bottom: 0.28rem;
  background: #FFFFFF;
  form {
    width: 100%;
  }
  .form {
    .field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1rem;
      padding: 0 0.4rem;
      border-bottom: 1px solid #F2F2F2;
      box-sizing: border-box;
      .name {
        flex-shrink: 0;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51,51,51,1);
        line-height: 0.44rem;
        margin-right: 0.1rem;
      }
      .value {
        flex-grow: 1;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: 0.44rem;
        text-align: right;
        &::placeholder {
          font-size: 0.32rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(189,189,189,1);
          line-height: 0.44rem;
        }
      }

      .field-birthtime {
        flex-grow: 1;
        &::before {
          display: none;
        }
        /deep/ .weui-cell {
          padding: 0 !important;
          .vux-popup-picker-placeholder {
            font-size: 0.32rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(189,189,189,1);
            line-height: 0.44rem;
          }
          .vux-popup-picker-value {
            font-size: 0.32rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #333333;
            line-height: 0.44rem;
          }
        }
      }

      .gender-group {
        display: flex;
        align-items: center;
        .gender-wrapper {
          &:first-child {
            .gender-button {
              border-radius: 0.08rem 0 0 0.08rem;
            }
          }
          &:last-child {
            .gender-button {
              border-radius: 0 0.08rem 0.08rem 0;
            }
          }
          .gender-button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.32rem;
            height: 0.72rem;
            background: #F2F2F2;
            .icon {
              display: block;
              width: 0.36rem;
              height: 0.36rem;
              margin-right: 0.12rem;
              &.normal {
                display: block;
              }
              &.checked {
                display: none;
              }
            }
            .text {
              font-size: 0.28rem;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(215,215,215,1);
              line-height: 0.28rem;
            }
          }
          .gender-checkbox {
            display: none;
            &:checked ~ .gender-button {
              background: linear-gradient(5deg,rgba(234,72,110,1) 0%,rgba(210,46,84,1) 100%);
              .icon {
                &.normal {
                  display: none;
                }
                &.checked {
                  display: block;
                }
              }
              .text {
                color: #FFFFFF;
              }
            }
          }
        }
      }
    }
  }

  .btn-save {
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
    margin-top: 0.28rem;
  }
}
</style>
