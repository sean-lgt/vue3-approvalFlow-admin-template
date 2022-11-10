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
            <el-button size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDel(scope.row._id)"
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="showFormDialog"
      title="部门操作"
      @close="resetDialogForm"
    >
      <el-form
        :model="deptForm"
        ref="deptFormRef"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="parentId" label="上级部门">
          <el-cascader
            v-model="deptForm.parentId"
            :options="deptList"
            :props="{ checkStrictly: true, label: 'deptName', value: '_id' }"
            clearable
          />
        </el-form-item>
        <el-form-item prop="deptName" label="部门名称">
          <el-input
            type="text"
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
          />
        </el-form-item>
        <el-form-item prop="userName" label="负责人">
          <el-select
            placeholder="请选择负责人"
            v-model="deptForm.userName"
            @change="onUserSelectChange"
          >
            <el-option
              v-for="user in userAllList"
              :key="user._id"
              :label="user.userName"
              :value="user"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="userEmail" label="负责人邮箱">
          <el-input
            type="text"
            v-model="deptForm.userEmail"
            placeholder="请输入负责人邮箱"
            disabled
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="info" @click="onCloseDialog">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, toRaw, nextTick } from 'vue'
import utils from '../../utils/utils'
import { ElMessage } from 'element-plus' // 引入mess组件时需要引入样式
import 'element-plus/es/components/message/style/css'

import { deptListApi, userAllListApi, deptOperateApi } from '../../api/index'

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
const handleEdit = (rowItem) => {
  action.value = 'edit'
  showFormDialog.value = true
  nextTick(() => {
    Object.assign(deptForm, rowItem)
  })
}

// 点击删除
const handleDel = async (_id) => {
  action.value = 'delete'
  const params = { _id, action: action.value }
  const submitResult = await deptOperateApi(params)
  ElMessage({
    message: '删除成功',
    grouping: true,
    type: 'success'
  })
  fetchDeptList() //请求列表
}

// 获取部门列表
const fetchDeptList = async () => {
  const params = { ...searchForm }
  const list = await deptListApi(params)
  deptList.value = list
}

fetchDeptList() // 请求数据

// 新增编辑操作
const showFormDialog = ref(false)
const deptFormRef = ref()
const deptForm = reactive({
  parentId: [null],
  deptName: '',
  userName: '',
  userEmail: ''
})
const userAllList = ref([])
const action = ref('add')
const rules = {
  deptName: {
    required: true,
    message: '必须填写部门名称',
    trigger: 'blur'
  },
  parentId: {
    required: true,
    message: '必须选择上级部门',
    trigger: 'blur'
  },
  userName: { required: true, message: '必须选择负责人', trigger: 'blur' }
}

// 获取所有用户列表，选择负责人
const fetchAllUserList = async () => {
  const list = await userAllListApi()
  userAllList.value = list
}
fetchAllUserList()

// 点击创建部门
const handleDeptCreate = () => {
  action.value = 'add'
  showFormDialog.value = true
}
// 重置表单内容
const resetDialogForm = () => {
  if (!deptFormRef.value) return
  deptFormRef.value.resetFields()
}

// 监听负责人改变
const onUserSelectChange = (row) => {
  const { userId, userName, userEmail } = row
  Object.assign(deptForm, { userId, userName, userEmail }) // 增加数据
}

// 点击弹窗取消
const onCloseDialog = () => {
  resetDialogForm()
  showFormDialog.value = false
}

// 点击弹出提交
const onSubmit = async () => {
  if (!deptFormRef.value) return
  await deptFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      //  校验成功 可以提交
      const params = toRaw(deptForm) //转为普通对象
      params.action = action.value
      const submitResult = await deptOperateApi(params)
      ElMessage({
        message: '操作成功',
        grouping: true,
        type: 'success'
      })
      fetchDeptList() //重新请求列表
      showFormDialog.value = false
      deptFormRef.value.resetFields() //清空原表单
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
