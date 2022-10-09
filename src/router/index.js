import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
  path: '/',
  redirect: '/welcome',
  name: 'home',
  meta: {
    title: '首页',
  },
  component: () =>
    import( /* webpackChunkName: "home" */ '@/views/Home/index.vue'),
  children: [{
    path: '/welcome',
    name: 'welcome',
    meta: {
      title: '欢迎页',
    },
    component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/Home/welcome.vue')
  }, ],
}, {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录页',
  },
  component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/Login/index.vue')
}]


const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router
