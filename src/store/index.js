/*
 * Vuex 全局状态管理
 */
import { createStore } from 'vuex'
import Storage from '../utils/storage'
import { noticeCountApi } from "../api/index";

const storage = new Storage()

const store = createStore({
  state: {
    userInfo: storage.getItem('userInfo') || {},
    menuList: storage.getItem('menuList') || [],
    actionList: storage.getItem('actionList') || [],
    leaveCount: 0, //审核通知
  },
  mutations: {
    saveUserInfo(state, payload) {
      state.userInfo = payload
      storage.setItem('userInfo', payload)
    },
    saveMenuList(state, payload) {
      state.menuList = payload
      storage.setItem('menuList', payload)
    },
    saveActionList(state, payload) {
      state.actionList = payload
      storage.setItem('actionList', payload)
    },
    setLeaveCount(state, payload) {
      state.leaveCount = payload
    }
  },
  actions: {
    async getLeaveCount({ commit }) {
      const count = await noticeCountApi() //获取通知数量
      commit('setLeaveCount', count || 0)
    }
  }
})

export default store
