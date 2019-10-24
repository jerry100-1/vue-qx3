import Vue from 'vue';
import Vuex from 'vuex';
import { GlobalApi } from '@/api'
import Util from '@/common/js/util'

Vue.use(Vuex);

const state = {
  UserInfo: {},
  HistoryState: {},
  Config: new Map()
}

// getters
const getters = {
  UserInfo: state => state.UserInfo,
  HistoryState: state => state.HistoryState,
  Config: state => state.Config
}

const actions = {
  setUserInfo ({ commit, state }, data){
    commit('setUserInfo', { data })
  },
  setHistoryState ({ commit, state }, data) {
    commit('setHistoryState', { data })
  },
  // 获取用户信息
  getUserInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.UserInfo && Object.keys(state.UserInfo).length > 0) {
        return resolve()
      }
      GlobalApi.getUserInfo({ unionid: Util.getSearchJson().auth }).then(data => {
        if (data.Status === 200) {
          commit('setUserInfo', { data: { ...data.Result, Auth: Util.getSearchJson().auth }})
          resolve()
        } else {
          reject(new Error(data.Result.ErrorMsg))
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取授权域名等配置
  getConfig ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.Config && state.Config.size > 0) {
        return resolve()
      }
      GlobalApi.getConfig().then(data => {
        if (data.Status === 200) {
          commit('setConfig', new Map(Object.entries(data.Result || {})))
          resolve()
        } else {
          reject(new Error(data.Result.ErrorMsg))
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

const mutations = {
  setUserInfo (state, { data }) {
    state.UserInfo = { ...data, ...(process.env.ENV_CONFIG === 'dev' ? { ComplaintJumpUrl: '' } : {}) }
  },
  setHistoryState (state, { data }) {
    state.HistoryState = data
  },
  setConfig (state, data) {
    state.Config = data
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
  }
})
