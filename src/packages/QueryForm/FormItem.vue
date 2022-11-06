<template>
  <el-form-item :prop="item.model">
    <el-input
      v-if="item.type === 'input'"
      placeholder="请输入用户ID"
      v-bind="$attrs"
    ></el-input>
    <!-- v-bind="$attrs" 事件透传 -->
    <el-select v-else-if="item.type === 'select'" v-bind="$attrs">
      <el-option
        v-for="(option, index) in item.options"
        :key="index"
        v-bind="option"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive } from 'vue'
defineOptions({
  name: 'QueryFormItem'
})

const props = defineProps({
  // 子组件接收父组件传递过来的值
  item: {
    type: Array,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped></style>
