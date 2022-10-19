<template>
  <div class="user-manage">
    <div class="query-form">
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
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
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
            <el-button @click="handleEdit(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { userListApi, userDelApi } from './../../api/index'
import { ElMessage } from 'element-plus' // 引入mess组件时需要引入样式
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
const handleQuery = () => {
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
    prop: 'createTime',
    width: 180
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
    width: 180
  }
])
</script>

<style lang="scss" scoped></style>
