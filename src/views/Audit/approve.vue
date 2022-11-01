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
    <!-- 查看弹窗 -->
    <el-dialog
      title="审批详情"
      v-model="showDetailDialog"
      destroy-on-close
      @close="handleResetAuditForm"
    >
      <el-form
        label-width="120px"
        :model="auditForm"
        ref="auditFormRef"
        :rules="rules"
      >
        <el-form-item class="detail-dialog-item" label="休假类型:">
          {{ calcCurrentDetail.applyType }}
        </el-form-item>
        <el-form-item class="detail-dialog-item" label="休假时间:">
          {{ calcCurrentDetail.leaveTimeArea }}
        </el-form-item>
        <el-form-item class="detail-dialog-item" label="休假时长:">
          {{ calcCurrentDetail.leaveTime }}
        </el-form-item>
        <el-form-item class="detail-dialog-item" label="休假原因:">
          {{ calcCurrentDetail.reasons }}
        </el-form-item>
        <el-form-item class="detail-dialog-item" label="审批状态:">
          {{ calcCurrentDetail.applyStateText }}
        </el-form-item>
        <el-form-item class="detail-dialog-item" label="审批人:">
          {{ calcCurrentDetail.auditUsers }}
        </el-form-item>
        <el-form-item class="detail-dialog-item" label="当前审批人:">
          {{ calcCurrentDetail.curAuditUserName }}
        </el-form-item>
        <el-form-item label="请输入审核备注" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入审核备注"
            rows="4"
            v-model="auditForm.remark"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onSubmit('pass')" type="primary">审核通过</el-button>
        <el-button @click="onSubmit('refuse')" type="danger">驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, toRaw, computed } from 'vue'
import { useStore } from 'vuex'
import { leaveListApi, approveOperateApi } from './../../api/index'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus' // 引入mess组件时需要引入样式
import utils from '../../utils/utils'
import Storage from '../../utils/storage'

const storage = new Storage()

const store = useStore()

const applyStateMap = {
  审批通过: ['待审批', '审批中', '审批通过'],
  审批拒绝: ['待审批', '审批中', '审批拒绝'],
  残忍拒绝: ['待审批', '审批中', '残忍拒绝'],
  作废: ['待审批', '审批中', '作废']
}

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

// 重置表单
const action = ref('')
const showDetailDialog = ref(false)
const auditFormRef = ref()
const currentDetail = reactive({})
const auditForm = reactive({ remark: '' })
const calcCurrentDetail = computed(() => {
  const {
    applyType,
    leaveTime,
    reasons,
    applyState,
    auditUsers,
    startTime,
    endTime,
    curAuditUserName
  } = currentDetail
  const result = {}
  result.auditUsers = auditUsers
  result.curAuditUserName = curAuditUserName
  result.leaveTime = leaveTime
  result.reasons = reasons
  result.leaveTimeArea =
    utils.formateDate(new Date(startTime), 'yyyy-MM-dd') +
    ' 至 ' +
    utils.formateDate(new Date(endTime), 'yyyy-MM-dd')
  result.applyType = { 1: '事假', 2: '调休', 3: '年假' }[applyType]
  result.applyStateText = {
    1: '待审批',
    2: '审批中',
    3: '审批拒绝',
    4: '审批通过',
    5: '作废'
  }[applyState]
  if (result.applyStateText === '审批拒绝') {
    result.steps = applyStateMap['审批拒绝']
  } else if (result.applyState === '作废') {
    result.steps = applyStateMap['作废']
  } else {
    result.steps = applyStateMap['审批通过']
  }
  result.currentStep =
    result.steps.findIndex((it) => it === result.applyStateText) + 1
  return result
})

const handleResetAuditForm = () => {
  if (!auditFormRef.value) return
  auditFormRef.value.resetFields()
}

const handleAudit = (row) => {
  showDetailDialog.value = true
  Object.assign(currentDetail, toRaw(row))
}

const onSubmit = async (type) => {
  action.value = type
  const params = {}
  params.remark = auditForm.remark
  params.action = action.value
  params._id = currentDetail._id
  const submitResult = await approveOperateApi(params)
  ElMessage({
    message: '提交成功',
    grouping: true,
    type: 'success'
  })
  fetchLeaveList() //重新请求列表
  store.dispatch('getLeaveCount') //获取通知数量
  showDetailDialog.value = false
}
</script>

<style lang="scss" scoped></style>
