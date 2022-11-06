<template>
  <el-form ref="formRef" inline :model="formModel">
    <template v-for="(item, index) in form" :key="index">
      <FormItem
        :item="item"
        v-model="formModel[item.model]"
        v-bind="item"
      ></FormItem>
    </template>

    <!-- <el-form-item prop="userId">
      <el-input v-model="user.userId" placeholder="请输入用户ID" />
    </el-form-item>
    <el-form-item prop="userName">
      <el-input v-model="user.userName" placeholder="请输入用户名称" />
    </el-form-item>
    <el-form-item prop="state">
      <el-select v-model="user.state">
        <el-option :value="0" label="所有"></el-option>
        <el-option :value="1" label="在职"></el-option>
        <el-option :value="2" label="离职"></el-option>
        <el-option :value="3" label="试用期"></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleResetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
/**
 * form = [
 *  {
 *    type:'input',
 *    model:'userID',
 *    label:'用户Id',
 *    placeholder:'请输入'
 *  }
 * ]
 *
 */
import { defineProps, defineEmits, ref, reactive } from 'vue'
import FormItem from './FormItem.vue'

defineOptions({
  name: 'QueryForm'
})

const props = defineProps({
  // 子组件接收父组件传递过来的值
  form: {
    type: Array,
    default: () => []
  },
  // v-model 语法糖
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'handleQuery'])

const formRef = ref()
const formModel = reactive({
  ...props.modelValue
})

// 重置表单
const handleResetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}

// 点击查询
const handleQuery = () => {
  console.log('🚀【modelValue】', props.modelValue)
  // TODO:
  // emit('handleQuery', { userId: 888, userName: 'jack' })
  // v-model 语法糖
  emit('update:modelValue', { ...formModel })
  emit('handleQuery', { ...formModel })
}
</script>

<style lang="scss" scoped></style>
