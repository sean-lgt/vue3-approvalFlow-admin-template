<template>
  <div class="page-404">
    <img src="@/assets/images/404.jpeg" alt="" />
    <el-button class="btn-404" size="medium" @click="$router.push('/')"
      >返回首页</el-button
    >
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.page-404 {
  width: 100vw;
  height: 100vh;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .btn-404 {
    position: fixed;
    bottom: 100px;
  }
}
</style>
