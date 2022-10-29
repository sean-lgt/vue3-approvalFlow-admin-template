import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'

const routes = [{
    path: '/',
    redirect: '/welcome',
    name: 'home',
    meta: {
      title: '首页',
    },
    component: Home,
    // /system/user
    children: [{
        path: '/welcome',
        name: 'welcome',
        meta: {
          title: '欢迎页',
        },
        component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/Home/welcome.vue')
      }, {
        path: '/system/user',
        name: 'systemUser',
        meta: {
          title: '用户管理',
        },
        component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/user.vue')
      },
      {
        path: '/system/menu',
        name: 'systemMenu',
        meta: {
          title: '菜单管理',
        },
        component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/menu.vue')
      },
      {
        path: '/system/role',
        name: 'systemRole',
        meta: {
          title: '角色管理',
        },
        component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/role.vue')
      },
      {
        path: '/system/dept',
        name: 'systemDept',
        meta: {
          title: '部门管理',
        },
        component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/dept.vue')
      },
    ],
  }, {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/Login/index.vue')
  },
  {
    name: "404",
    path: "/:pathMatch(.*)",
    meta: { title: "未找到该页面" },
    component: () => import("@/views/NotFound/404.vue"),
  },
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})


// 判断当前地址是否可以访问
const checkPermission = (path) => {
  const hasPermission = router.getRoutes().filter(route => route.path == path).length;
  if (hasPermission) {
    return true
  } else {
    return false
  }
}

// 导航守卫
router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    console.log('🚀【寄哪里发大水发】', );
    next()
  } else {
    next()
    // next('/404')
  }
})




export default router
