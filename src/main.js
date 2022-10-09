import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' //引入路由
import projectConfig from './config'
// 全局引入
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

console.log("当前环境", projectConfig.ENV)
console.log("当前环境", projectConfig)

// 测试 eslint 结合 husky + lint-staged
console.log('test,lint-staged')

createApp(App).use(router).mount('#app')
