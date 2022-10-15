<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">通用工作流后台管理系统</div>
      <div class="desc">
        - Vue3.x + ElementPlus + Koa2 + Mongo 打造的后台管理系统
      </div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      margin-top: 4px;
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 105px;
    background-image: url('@/assets/images/welcome.png');
    width: 371px;
    height: 438px;
  }
}
</style>
