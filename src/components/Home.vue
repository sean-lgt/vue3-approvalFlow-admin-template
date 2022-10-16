<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统llogo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="" />
        <span v-if="!isCollapse">Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        default-active="2"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
        router
      >
        <TreeMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggleCollapse">
            <el-icon v-if="!isCollapse"><Fold /></el-icon>
            <el-icon v-if="isCollapse"><Expand /></el-icon>
          </div>
          <div class="bread">面包屑</div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱： {{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view class="main-page"></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import TreeMenu from './TreeMenu.vue'
import {
  Setting,
  Fold,
  Bell,
  ArrowDown,
  Expand,
  Connection
} from '@element-plus/icons-vue'

import { noticeCountApi, menuListApi } from '../api/index'

const store = useStore()
const router = useRouter()

const isCollapse = ref(false)

const userInfo = computed(() => store.state.userInfo)

// 点击退出
const handleLogout = (key) => {
  if (key == 'email') return
  store.commit('saveUserInfo', '')
  userInfo.value = null
  router.push('/login')
}

// 点击切换展开
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 获取通知数量
const noticeCount = ref(0)
const fetchNoticeCount = async () => {
  try {
    const count = await noticeCountApi()
    noticeCount.value = count
  } catch (error) {
    console.error('获取通知数量错误', error)
  }
}
fetchNoticeCount()

// 获取菜单列表
let userMenu = ref([])
const fetchMenuList = async () => {
  try {
    const list = await menuListApi()
    console.log('🚀【获取菜单列表数据】', list)
    userMenu.value = list
  } catch (error) {
    console.error('获取菜单列表数据错误', error)
  }
}
fetchMenuList()
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
      cursor: pointer;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        // align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 26px;
          line-height: 56px;
          cursor: pointer;
        }
      }
      .user-info {
        display: flex;
        align-items: center;
        .notice {
          line-height: 30px;
          margin-right: 18px;
          margin-top: 6px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
          display: flex;
          align-items: center;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
