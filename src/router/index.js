import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import Home from '@/components/Home.vue'
import { permissionMenuListApi } from '../api/index'
import Storage from '../utils/storage'
const storage = new Storage()



const routes = [{
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/',
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
      },
      // {
      //   path: '/system/user',
      //   name: 'systemUser',
      //   meta: {
      //     title: '用户管理',
      //   },
      //   component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/user.vue')
      // },
      // {
      //   path: '/system/menu',
      //   name: 'systemMenu',
      //   meta: {
      //     title: '菜单管理',
      //   },
      //   component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/menu.vue')
      // },
      // {
      //   path: '/system/role',
      //   name: 'systemRole',
      //   meta: {
      //     title: '角色管理',
      //   },
      //   component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/role.vue')
      // },
      // {
      //   path: '/system/dept',
      //   name: 'systemDept',
      //   meta: {
      //     title: '部门管理',
      //   },
      //   component: () => import( /* webpackChunkName: "homeWelcome" */ '@/views/System/dept.vue')
      // },
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

// 判断当前是否已登录
const tokenValidate = () => {
  const userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    return true
  } else {
    return false
  }
}

// 加载动态路由
const loadAsyncRoutes = async () => {
  const isLogin = tokenValidate() // 判断是否已经登录
  if (isLogin) {
    const { menuList } = await permissionMenuListApi()
    const result = generatorRoutes(menuList)
    console.log("结构", result)
    result.forEach((route) => {
      const path = `../views${route.component}.vue`
      // 动态添加路由
      // bug：使用动态路由报错 The above dynamic import cannot be analyzed by Vite.
      router.addRoute('home', { ...route, component: () => defineAsyncComponent(() => import( /* @vite-ignore */ path)) })
      console.log('🚀【进来】', router);
    })
    console.log('🚀【路由ssss】', router);
  } else {
    // 未登录 直接跳转登录页
    router.push('/login')
  }

}



// 组装动态路由
const generatorRoutes = (menuList) => {
  let routes = []
  const deepList = (list) => {
    while (list.length) {
      const item = list.pop() //出栈
      if (!item.icon) {
        // 有action 按钮权限 说明是最有一级菜单
        routes.push({
          name: item.component,
          path: item.path,
          meta: {
            title: item.menuName
          },
          component: item.component
        })
      }

      if (item.children && item.icon) {
        // 递归遍历
        deepList(item.children)
      }
    }
  }
  deepList(JSON.parse(JSON.stringify(menuList))) // 深拷贝递归
  return routes
}


await loadAsyncRoutes() //请求加载路由

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
// router.beforeEach((to, from, next) => {

//   if (checkPermission(to.path)) {
//     document.title = to.meta.title;
//     next()
//   } else {
//     document.title = to.meta.title;
//     next()
//     // next('/404')
//   }
// })




export default router
