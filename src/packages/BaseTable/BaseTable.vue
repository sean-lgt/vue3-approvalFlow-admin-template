<template>
  <div class="base-table">
    <div class="action">
      <!-- 使用插槽 -->
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          type="selection"
          width="55"
          v-if="item.type == 'selection'"
        ></el-table-column>
        <el-table-column v-bind="item" v-else-if="!item.type"></el-table-column>
        <el-table-column v-else-if="item.type == 'action'" v-bind="item">
          <template #default="scope">
            <template v-for="(btn, index) in item.list" :key="index">
              <el-button
                :type="btn.type || 'text'"
                size="small"
                @click="handleAction(index, scope.row)"
                >{{ btn.text }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </template>

      <!-- <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            @click="handleEdit(scope.row)"
            size="mini"
            v-has="'user-edit'"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="handleDel(scope.row)"
            v-has="'user-delete'"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev,pager,next"
      :total="pager.total"
      :page-size="pager.pageSize"
      @current-change="handleCurrentPageChange"
    ></el-pagination>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineOptions({
  name: 'BaseTable'
})

const props = defineProps({
  // 子组件接收父组件传递过来的值
  columns: {
    type: Array,
    default: () => []
  },
  pager: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits([
  'handleAction',
  'handleCurrentPageChange',
  'handleSelectionChange'
])

const handleAction = (index, row) => {
  console.log('🚀【点击】', index)
  console.log('🚀【点击】', row)
  emit('handleAction', { index, row: { ...row } })
}

const handleCurrentPageChange = (pageNum) => {
  emit('handleCurrentPageChange', pageNum)
}

const handleSelectionChange = (list) => {
  emit('handleSelectionChange', list)
}
</script>

<style lang="scss" scoped></style>
