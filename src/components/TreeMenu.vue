
<script setup>
import { toRefs, ref, defineProps, watch } from 'vue'
import { Setting, Connection } from '@element-plus/icons-vue'

const props = defineProps({
  // 子组件接收父组件传递过来的值
  userMenu: {
    type: Array,
    default: () => []
  }
})

console.log('props', props)
</script>

<template>
  <template v-for="menu in userMenu" :key="menu._id">
    <el-sub-menu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :key="menu._id"
      :index="menu.path"
    >
      <template #title>
        <el-icon
          ><component
            :is="menu.icon == 'Setting' ? Setting : Connection"
          ></component
        ></el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item
      v-else-if="menu.menuType == 1"
      :index="menu.path"
      :key="menu._id + 1"
      >{{ menu.menuName }}
    </el-menu-item>
  </template>
</template>


<style lang="scss" scoped></style>
