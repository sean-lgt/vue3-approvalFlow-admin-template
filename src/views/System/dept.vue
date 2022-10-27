<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :model="searchForm" inline ref="searchFormRef">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            type="text"
            v-model="searchForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleDeptCreate">新增部门</el-button>
      </div>
      <el-table :data="deptList" stripe style="width: 100%" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="260">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDel(scope.row._id)"
              size="mini"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import utils from '../../utils/utils'
import { ElMessage } from 'element-plus' // 引入mess组件时需要引入样式
import 'element-plus/es/components/message/style/css'

import { deptListApi } from '../../api/index'

const searchFormRef = ref()
const searchForm = reactive({
  deptName: ''
})
const deptList = ref([]) //部门列表

const columns = [
  { prop: 'deptName', label: '部门名称' },
  { prop: 'userName', label: '负责人' },
  {
    prop: 'updateTime',
    label: '更新时间',
    formatter(row, column, val) {
      return utils.formateDate(new Date(val))
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    formatter(row, column, val) {
      return utils.formateDate(new Date(val))
    }
  }
]

// 点击查询
const handleQuery = () => {
  fetchDeptList() //执行请求
}

// 点击重置
const handleResetQuery = () => {
  if (!searchFormRef.value) return
  searchFormRef.value.resetFields()
}

// 点击编辑
const handleEdit = (rowItem) => {}

// 点击删除
const handleDel = (_id) => {}

// 获取部门列表
const fetchDeptList = async () => {
  const params = { ...searchForm }
  const list = await deptListApi(params)
  deptList.value = list
}

fetchDeptList() // 请求数据
</script>

<style lang="scss" scoped></style>
