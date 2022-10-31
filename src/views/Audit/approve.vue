<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form ref="formRef" inline :model="queryForm">
        <el-form-item prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="所有"></el-option>
            <el-option value="1" label="待审批"></el-option>
            <el-option value="2" label="审批中"></el-option>
            <el-option value="3" label="审批拒绝"></el-option>
            <el-option value="4" label="审批通过"></el-option>
            <el-option value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleQueryReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <el-table :data="leaveList" stripe show-header>
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
              v-if="[1].includes(scope.row.applyState)"
              type="primary"
              @click="handleAudit(scope.row)"
              size="mini"
              >审核
            </el-button>
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
import { reactive, ref, onMounted, toRaw, computed } from 'vue'
import { leaveListApi, leaveOperateApi } from './../../api/index'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus' // 引入mess组件时需要引入样式
import utils from '../../utils/utils'
import Storage from '../../utils/storage'

const storage = new Storage()

const formRef = ref()
// 查询表单
const queryForm = reactive({
  applyState: ''
})

//分页数据
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 列表
// reactive() 不可重新赋值（会丢失响应性）,适合对象类型，键值对，如果需要赋值操作需要使用ref，ref() 有一个 .value 属性可以用来重新赋值
let leaveList = ref([])

const columns = [
  { prop: 'orderNo', label: '单号' },
  {
    prop: '',
    label: '申请人',
    formatter(row) {
      return row.applyUser.userName
    }
  },
  {
    prop: 'startTime',
    label: '休假时间',
    width: '200px',
    formatter(row, col, val) {
      const { startTime, endTime } = row
      return (
        utils.formateDate(new Date(startTime), 'yyyy-MM-dd') +
        ' 至 ' +
        utils.formateDate(new Date(endTime), 'yyyy-MM-dd')
      )
    }
  },
  { prop: 'leaveTime', label: '休假时长' },
  {
    prop: 'applyType',
    label: '休假类型',
    formatter(_1, _2, val) {
      return { 1: '事假', 2: '调休', 3: '年假' }[val]
    }
  },
  { prop: 'reasons', label: '休假原因' },
  {
    prop: 'createTime',
    label: '申请时间',
    width: '200px',
    formatter(_1, _2, val) {
      return utils.formateDate(new Date(val))
    }
  },
  { prop: 'auditUsers', label: '审批人' },
  { prop: 'curAuditUserName', label: '当前审批人' },
  {
    prop: 'applyState',
    label: '审批状态',
    formatter(_1, _2, val) {
      return {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废'
      }[val]
    }
  }
]

const fetchLeaveList = async () => {
  let params = { ...toRaw(queryForm), ...toRaw(pager) }
  params.type = 'approve'
  try {
    const { list, page } = await leaveListApi(params)
    leaveList.value = list //赋值
    pager.total = page.total //总条数
  } catch (error) {
    console.log('🚀【获取列表失败】', error)
  }
}

fetchLeaveList() // 请求获取列表

// 点击查询
const handleQuery = () => {
  pager.pageNum = 1
  pager.pageSize = 10
  pager.total = 0
  fetchLeaveList()
}

// 重置查询
const handleQueryReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}

// 分页切换
const handleCurrentPageChange = (current) => {
  pager.pageNum = current
  fetchLeaveList()
}
</script>

<style lang="scss" scoped></style>
