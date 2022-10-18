<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form inline :model="user">
        <el-form-item>
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
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
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const a = 'sdfafa'
// 查询表单
const user = reactive({
  userId: '',
  userName: '',
  state: ''
})

// 用户列表
const userList = reactive([
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
