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
    <!-- 添加role弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      title="角色管理"
      width="40%"
      @close="handleCloseAddDialog"
    >
      <el-form
        ref="addFormRef"
        :model="roleAddForm"
        label-width="100px"
        :rules="addRoleRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            type="text"
            placeholder="请输入角色名称"
            v-model="roleAddForm.roleName"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            rows="4"
            placeholder="请输入备注"
            v-model="roleAddForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="onRoleOperate">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, toRaw, nextTick } from 'vue'
import utils from '../../utils/utils'
import { roleListApi, roleOperateApi } from '../../api/index'
import { ElMessage } from 'element-plus' // 引入mess组件时需要引入样式
import 'element-plus/es/components/message/style/css'

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

const action = ref('add')
// 添加/修改角色dialog弹窗
const showAddDialog = ref(false)
const addFormRef = ref()

const roleAddForm = reactive({
  roleName: '',
  remark: ''
})

const addRoleRules = {
  roleName: {
    required: true,
    message: '必须填写角色名称',
    trigger: 'blur'
  }
}

// 点击编辑
const handleEdit = (role = {}) => {
  action.value = 'edit'
  showAddDialog.value = true
  nextTick(() => {
    for (const key in role) {
      roleAddForm[key] = role[key]
    }
  })
}

// 点击删除
const handleDel = async (_id) => {
  action.value = 'delete'
  const params = { _id }
  params.action = action.value
  const submitResult = await roleOperateApi(params)
  ElMessage({
    message: '删除成功',
    grouping: true,
    type: 'success'
  })
  fetchRoleList() //重新请求列表
}

// 点击创建角色
const handleRoleCreate = () => {
  action.value = 'add'
  showAddDialog.value = true
}

// 监听dialog 关闭
const handleCloseAddDialog = () => {
  if (!addFormRef.value) return
  addFormRef.value.resetFields()
}

// 点击确认增加role
const onRoleOperate = async () => {
  if (!addFormRef.value) return
  await addFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      //  校验成功 可以提交
      const params = toRaw(roleAddForm) //转为普通对象
      params.action = action.value
      const submitResult = await roleOperateApi(params)
      ElMessage({
        message: '创建成功',
        grouping: true,
        type: 'success'
      })
      fetchRoleList() //重新请求列表
      showAddDialog.value = false
      addFormRef.value.resetFields() //清空原表单
    } else {
      console.log('error submit!', fields)
      ElMessage({
        message: '请先完成表单',
        grouping: true,
        type: 'error'
      })
    }
  })
}
</script>

<style lang="scss" scoped></style>
