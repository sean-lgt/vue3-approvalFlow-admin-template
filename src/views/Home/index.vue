<template>
  <div>首页</div>
  <el-button>测试 element Plus</el-button>
  <el-table></el-table>
  <br />
  <router-link to="/login">去登录</router-link>
  <router-view></router-view>
</template>

<script setup>
import { testAxios } from '@/api/index.js'

testAxios({ test: 'aaaa' })
  .then((res) => {
    console.log('🚀【请求成功】', res)
  })
  .catch((err) => {
    console.log('🚀【请求报错】', err)
  })
</script>

<style lang="scss" scoped>
</style>
