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
import Storage from '../../utils/storage'
const storage = new Storage()
storage.setItem('aaa', 'teststorage')

console.log('🚀【测试storage】', storage.getItem('test'))
console.log('🚀【测试storage】', storage.getItem('aaa'))

testAxios({ test: 'aaaa' })
  .then((res) => {
    console.log('🚀【请求成功】', res)
  })
  .catch((err) => {
    console.log('🚀【请求报错】', err)
  })
</script>

<style lang="scss" scoped></style>
