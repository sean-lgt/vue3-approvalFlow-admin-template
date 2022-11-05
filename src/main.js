import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router' //引入路由
import store from './store/index' // vuex状态管理
import projectConfig from './config'

// 全局引入自定义组件
import QueryForm from './packages/QueryForm'
// 全局引入
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// 引入 Storage
import Storage from './utils/storage'
const storage = new Storage()

console.log('当前环境', projectConfig.ENV)
console.log('当前环境', projectConfig)

// 测试 eslint 结合 husky + lint-staged
console.log('test,lint-staged')

const app = createApp(App)

// 定义全局指令 控制按钮权限
app.directive('has', {
  // 定义钩子、生命周期
  beforeMount: (el, binding) => {
    console.log('🚀【元素】el', el);
    console.log('🚀【内容】binding', binding);
    // 获取按钮权限
    const userActionPermission = storage.getItem('actionList')
    const value = binding.value
    // 判断列表中是都有对应的权限标识
    const hasPermission = userActionPermission.includes(value)
    if (!hasPermission) {
      el.style = 'display:none;width:0;height:0;' //无权限，先隐藏元素
      // 此时dom节点还未渲染到页面上，需要开启宏任务后再删除节点
      setTimeout(() => {
        el.parentNode.removeChild(el) // 直接移除元素
      }, 0)
    }
  }
})


app.use(router).use(store).use(QueryForm).mount('#app')
