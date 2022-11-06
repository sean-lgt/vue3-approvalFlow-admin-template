<script setup>
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 测试v-model
import VInput from './components/VInput.vue'

const locale = ref(zhCn)

// 测试v-model
let userName = ref('jack')
let title = ref('testTitle')
const handleSubmit = (e) => {
  console.log('🚀【父组件handleSubmit】', e)
  console.log('🚀【父组件userName】', userName)
  userName.value = e
}
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>

  <!-- 测试v-model -->
  <!-- <div>
    <v-input
      v-model="userName"
      v-model:title="title"
      @handleSubmit="handleSubmit"
    ></v-input>
  </div> -->
</template>

<style lang="scss">
@import '@/assets/style/reset.css';
@import '@/assets/style/index.scss';
</style>
