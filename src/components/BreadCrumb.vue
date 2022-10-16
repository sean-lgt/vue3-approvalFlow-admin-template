<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <router-link to="/welcome" v-if="index == 0">{{
        item.meta.title
      }}</router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const breadList = ref([])
const route = useRoute()
const router = useRouter()

watch(
  () => route.matched,
  (newValue, oldValue) => {
    breadList.value = newValue
  },
  { immediate: true }
)

console.log('🚀【路由】', route)
</script>

<style lang="scss" scoped>
</style>
