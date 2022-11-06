<template>
  <div class="user-manage">
    <div class="query-form">
      <!-- 使用封装自定义组件 -->
      <el-form ref="formRef" inline :model="user">
        <el-form-item prop="userId">
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
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery" v-has="'user-query'"
            >查询</el-button
          >
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- <query-form
        :form="form"
        v-model="user"
        @handleQuery="handleQuery"
      ></query-form> -->
    </div>
    <div class="base-table">
      <div class="action">
        <!-- 使用自定义指令控制按钮权限 -->
        <el-button
          type="primary"
          @click="handleCreate"
          v-has:add="'user-create'"
          >新增</el-button
        >
        <el-button type="danger" @click="handlePatchDel" v-has="'user-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="180">
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
        </el-table-column>
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
    <!-- 弹窗 -->
    <el-dialog title="用户新增" v-model="showModal">
      <el-form
        ref="dialogFormRef"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template #append>@admin.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="userForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="mobile">
          <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, toRaw } from 'vue'
import {
  userListApi,
  userDelApi,
  roleAllListApi,
  deptAllListApi,
  addUserApi
} from './../../api/index'
import { ElMessage } from 'element-plus' // 引入mess组件时需要引入样式
import utils from '../../utils/utils'
import 'element-plus/es/components/message/style/css'

const formRef = ref()
// 查询表单
const user = reactive({
  userId: '',
  userName: '',
  state: 1
})

//分页数据
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 用户列表
// reactive() 不可重新赋值（会丢失响应性），如果需要赋值操作需要使用ref，ref() 有一个 .value 属性可以用来重新赋值
let userList = ref([
  {
    state: 1,
    role: 8,
    roleList: ['66100', '66600', '68600'],
    deptId: ['ddda', 'dedea541'],
    userId: 10002,
    userName: 'admin',
    userEmail: 'jack@admin.com',
    createTime: '2022-01-01 11:11',
    lastLoginTime: '2022-07-07 07:07',
    _v: 0,
    job: '前端切图仔',
    mobile: '1781545571'
  }
])

const fetchUserList = async () => {
  let params = { ...user, ...pager }
  try {
    const { list, page } = await userListApi(params)
    userList.value = list //赋值
    pager.total = page.total //总条数
    console.log('🚀【获取用户列表数据】>>>', userList)
  } catch (error) {
    console.log('🚀【获取列表失败】', error)
  }
}

fetchUserList()

// 点击查询
const handleQuery = (values) => {
  console.log('🚀【拿到数据】', values)
  pager.pageNum = 1
  pager.pageSize = 10
  pager.total = 0
  fetchUserList()
}

// 重置查询
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}

// 分页切换
const handleCurrentPageChange = (current) => {
  pager.pageNum = current
  fetchUserList()
}

// 点击删除按钮
const handleDel = async (item) => {
  console.log('🚀【点击删除按钮】', item)
  const delResult = await userDelApi({
    userIds: [item.userId]
  })
  ElMessage({
    message: '删除成功',
    grouping: true,
    type: 'success'
  })
  fetchUserList() // 刷新数据
  console.log('🚀【结果id】', delResult)
}

const checkedUserIds = ref([])
// 监听更改选中
const handleSelectionChange = (list) => {
  let arr = []
  list.map((item) => {
    arr.push(item.userId)
  })
  checkedUserIds.value = arr
}
// 点击批量删除
const handlePatchDel = async () => {
  if (checkedUserIds.value.length == 0) {
    ElMessage({
      message: '请选择要删除的用户',
      grouping: true,
      type: 'error'
    })
    return
  }
  const delResult = await userDelApi({
    userIds: checkedUserIds.value
  })
  if (delResult.nModified > 0) {
    ElMessage({
      message: '删除成功',
      grouping: true,
      type: 'success'
    })
    fetchUserList()
  } else {
    ElMessage({
      message: '删除失败',
      grouping: true,
      type: 'error'
    })
  }
}

// 弹框显示对象
const showModal = ref(false)
const dialogFormRef = ref()
// 新增用户Form对象
const userForm = reactive({
  state: 3
})
// 所有角色列表
const roleList = ref([])
// 所有部门列表
const deptList = ref([])
// 定义用户操作行为
const action = ref('add')
// 定义表单校验规则
const rules = reactive({
  userName: [
    {
      required: true,
      message: '请输入用户名称',
      trigger: 'blur'
    }
  ],
  userEmail: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
  mobile: [
    {
      pattern: /1[3-9]\d{9}/,
      message: '请输入正确的手机号格式',
      trigger: 'blur'
    }
  ],
  deptId: [
    {
      required: true,
      message: '请输入用户邮箱',
      trigger: 'blur'
    }
  ]
})

// 获取用户部门列表
const fetchDeptList = async () => {
  const listResult = await deptAllListApi()
  deptList.value = listResult
  console.log('🚀【部门列表】', listResult)
}

// 获取角色列表
const fetchRoleList = async () => {
  const listResult = await roleAllListApi()
  roleList.value = listResult
  console.log('🚀【列表数据】', listResult)
}

onMounted(() => {
  fetchRoleList()
  fetchDeptList()
})

// 用户新增
const handleCreate = () => {
  action.value = 'add'
  showModal.value = true
}

// 用户弹窗关闭
const handleClose = () => {
  showModal.value = false
  dialogFormRef.value.resetFields() //清空原表单
}

// 点击确定提交
const handleSubmit = async () => {
  console.log('🚀【点击确定提交】')
  if (!dialogFormRef.value) return
  await dialogFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      //  校验成功 可以提交
      let params = toRaw(userForm) //响应式对象转换成普通对象
      params.userEmail += '@admin.com'
      params.action = action.value
      const submitResult = await addUserApi(params)
      ElMessage({
        message: '新增成功',
        grouping: true,
        type: 'success'
      })
      showModal.value = false
      dialogFormRef.value.resetFields() //清空原表单
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

// 点击编辑操作
const handleEdit = (editItem) => {
  console.log('点击编辑操作', editItem)
  action.value = 'edit'
  Object.assign(userForm, editItem) // 浅拷贝回显表单
  showModal.value = true
}

// 定义动态表格-格式
const columns = reactive([
  {
    label: '用户ID',
    prop: 'userId'
  },
  {
    label: '用户名',
    prop: 'userName'
  },
  {
    label: '用户邮箱',
    prop: 'userEmail'
  },
  {
    label: '用户角色',
    prop: 'role',
    formatter(row, column, value) {
      return {
        0: '管理员',
        1: '普通用户'
      }[value]
    }
  },
  {
    label: '用户状态',
    prop: 'state',
    formatter(row, column, value) {
      return {
        1: '在职',
        2: '离职',
        3: '试用期'
      }[value]
    }
  },
  {
    label: '注册时间',
    prop: 'ceateTime',
    width: 180,
    formatter: (row, column, value) => {
      return utils.formateDate(new Date(value))
    }
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
    width: 180,
    formatter: (row, column, value) => {
      return utils.formateDate(new Date(value))
    }
  }
])
</script>

<style lang="scss" scoped></style>
