import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' //引入路由

// 测试 eslint 结合 husky + lint-staged
console.log('test,lint-staged')

createApp(App).use(router).mount('#app')
