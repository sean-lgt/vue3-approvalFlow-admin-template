import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' //引入路由
// 全局引入
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

// 测试 eslint 结合 husky + lint-staged
console.log('test,lint-staged')

createApp(App).use(router).mount('#app')
