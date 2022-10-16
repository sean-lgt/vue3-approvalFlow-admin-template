/*
 * Vuex 全局状态管理
 */
import { createStore } from 'vuex'
import Storage from '../utils/storage'

const storage = new Storage()

const store = createStore({
  state: {
    userInfo: '' || storage.getItem('userInfo')
  },
  mutations: {
    saveUserInfo(state, payload) {
      state.userInfo = payload
      storage.setItem('userInfo', payload)
    }
  }
})

export default store
