/*
 * Vuex 全局状态管理
 */
import { createStore } from 'vuex'
import Storage from '../utils/storage'

const storage = new Storage()

const store = createStore({
  state: {
    userInfo: storage.getItem('userInfo') || {},
    menuList: storage.getItem('menuList') || [],
    actionList: storage.getItem('actionList') || []
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
    }
  }
})

export default store
