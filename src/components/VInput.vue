<template>
  <el-input v-model="newValue"></el-input>
  <el-button @click="handleSubmit">提交</el-button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
  // 子组件接收父组件传递过来的值
  modelValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'handleSubmit'])

// vue是不允许子组件改变父组件传来的参数值的
// const newValue = ref('')

// vue3中计算属性的函数中如果传入一个对象，表示的是get和set
const newValue = computed({
  get() {
    console.log('🚀【props】', props.modelValue)
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
    return props.modelValue
  }
})

const handleInput = (event) => {
  console.log('v-model', event)
  // newValue.value = event
  emit('update:modelValue', event)
}

const handleSubmit = () => {
  emit('handleSubmit', props.modelValue)
}
</script>

<style lang="scss" scoped></style>
