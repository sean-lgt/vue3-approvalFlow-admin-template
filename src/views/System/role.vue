<template>
  <div class="role-manage">
    <!-- 搜索 -->
    <div class="query-form">
      <el-form ref="queryFormRef" inline :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 角色列表 -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleRoleCreate">创建</el-button>
      </div>
      <el-table :data="roleList">
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
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleOpenPermission(scope.row)"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              @click="handleDel(scope.row._id)"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import utils from '../../utils/utils'
import { roleListApi } from '../../api/index'

const queryFormRef = ref()
const queryForm = reactive({
  roleName: ''
})

const pager = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
})

const roleList = ref([])

const columns = [
  {
    label: '角色名称',
    prop: 'roleName',
    width: 180
  },
  {
    label: '备注',
    prop: 'remark'
  },
  {
    label: '权限列表',
    width: 200,
    prop: 'permissionList'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    width: 150,
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    width: 150,
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  }
]

const fetchRoleList = async () => {
  try {
    const { list, page } = await roleListApi({ ...queryForm, ...pager })
    roleList.value = list
    pager.total = page.total
  } catch (error) {
    console.log('🚀【报错了】', error)
  }
}

fetchRoleList()

// 点击查询
const handleQuery = () => {
  fetchRoleList()
}

// 重置查询表单
const handleResetQuery = () => {
  if (!queryFormRef.value) return
  queryFormRef.value.resetFields()
}
</script>

<style lang="scss" scoped></style>
