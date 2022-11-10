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
      <div class="action">
        <el-button type="primary" @click="handleCreate">休假申请</el-button>
      </div>
      <el-table :data="leaveList">
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
            <el-button @click="handlePreview(scope.row)" size="small"
              >查看</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleInvalid(scope.row)"
              >作废</el-button
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
    <!-- 新增申请弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      title="休假申请"
      destroy-on-close
      @close="handleResetAddDialog"
    >
      <el-form
        :model="leaveForm"
        ref="leaveFormRef"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="休假类型" prop="applyType">
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="病假"></el-option>
            <el-option :value="4" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <div class="date-wrap">
          <el-form-item prop="startTime" label="休假时间">
            <el-date-picker
              style="margin: 0"
              v-model="leaveForm.startTime"
              placeholder="选择开始日期"
              @change="(val) => onChangeDate('startTime', val)"
            />
          </el-form-item>
          <div class="divider">-</div>
          <el-form-item prop="endTime" label-width="20px">
            <el-date-picker
              style="margin: 0"
              v-model="leaveForm.endTime"
              placeholder="选择结束日期"
              @change="(val) => onChangeDate('endTime', val)"
            />
          </el-form-item>
        </div>
        <el-form-item label="休假时差">
          {{ leaveForm.leaveDay }} 天
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input
            type="textarea"
            rows="4"
            v-model="leaveForm.reasons"
            placeholder="请输入休假原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="onSubmitForm">确定</el-button>
      </template>
    </el-dialog>
    <!-- 查看弹窗 -->
    <el-dialog title="审批详情" v-model="showDetailDialog" destroy-on-close>
      <el-steps :active="calcCurrentDetail.currentStep" align-center>
        <el-step
          v-for="step in calcCurrentDetail.steps"
          :key="step"
          :title="step"
        ></el-step>
      </el-steps>
      <el-form label-width="120px">
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
      </el-form>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
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
    prop: 'startTime',
    label: '休假时间',
    width: '220px',
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
  let params = { ...queryForm, ...pager }
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
  console.log('🚀【sdfafew22】')
  if (!formRef.value) return
  console.log('🚀【sdfaf】')
  formRef.value.resetFields()
}

// 分页切换
const handleCurrentPageChange = (current) => {
  pager.pageNum = current
  fetchLeaveList()
}

// 创建申请相关操作
const showAddDialog = ref(false)
const leaveFormRef = ref()
const action = ref('add')
const leaveForm = reactive({
  startTime: '',
  endTime: '',
  reasons: '',
  applyType: 1,
  leaveDay: 0 // 计算休假时长, 不需要传后端
})

const rules = {
  startTime: {
    required: true,
    message: '起始日期不能为空',
    trigger: ['blur', 'change']
  },
  endTime: {
    required: true,
    message: '结束日期不能为空',
    trigger: ['blur', 'change']
  },
  reasons: { required: true, message: '休假原因不能为空', trigger: 'blur' },
  applyType: {
    required: true,
    message: '休假类型不能为空',
    trigger: 'blur'
  }
}

// 监听日期选择改变
const onChangeDate = (dateKey, val) => {
  const { startTime, endTime } = leaveForm
  if (startTime > endTime && endTime) {
    leaveForm[dateKey] = ''
    leaveForm.leaveDay = 0
    ElMessage({
      message: '开始时间不能大于结束时间',
      grouping: true,
      type: 'error'
    })
    return
  }
  if (startTime && endTime) {
    leaveForm.leaveDay = (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 //计算请假时长
  }
}

// 关闭弹框时重置表单项
const handleResetAddDialog = () => {
  if (!leaveFormRef.value) return
  leaveFormRef.value.resetFields()
  leaveForm.leaveDay = 0
}

const handleCreate = () => {
  action.value = 'add'
  leaveForm.leaveDay = 0
  showAddDialog.value = true
}

// 点击确定提交
const onSubmitForm = async () => {
  if (!leaveFormRef.value) return
  await leaveFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      //  校验成功 可以提交
      const { userEmail, userId, userName } = storage.getItem('userInfo')
      const params = { ...toRaw(leaveForm), userEmail, userId, userName }
      params.action = action.value
      params.leaveTime =
        (leaveForm.endTime - leaveForm.startTime) / (24 * 60 * 60 * 1000) +
        1 +
        '天'
      const submitResult = await leaveOperateApi(params)
      ElMessage({
        message: '提交成功',
        grouping: true,
        type: 'success'
      })
      fetchLeaveList() //重新请求列表
      showAddDialog.value = false
      leaveFormRef.value.resetFields() //清空原表单
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

const applyStateMap = {
  审批通过: ['待审批', '审批中', '审批通过'],
  审批拒绝: ['待审批', '审批中', '审批拒绝'],
  残忍拒绝: ['待审批', '审批中', '残忍拒绝'],
  作废: ['待审批', '审批中', '作废']
}

// 点击查看详情
const showDetailDialog = ref(false)
const currentDetail = reactive({})
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

// 点击查看
const handlePreview = (row) => {
  showDetailDialog.value = true
  Object.assign(currentDetail, toRaw(row))
}

// 点击作废
const handleInvalid = async (row) => {
  action.value = 'delete'
  const params = {}
  params.action = action.value
  params._id = row._id
  const submitResult = await leaveOperateApi(params)
  ElMessage({
    message: '提交成功',
    grouping: true,
    type: 'success'
  })
  fetchLeaveList() //重新请求列表
}
</script>

<style lang="scss" scoped>
.leave-manage {
  .date-wrap {
    display: flex;
    justify-content: left;
    position: relative;
    .el-form-item {
      width: 280px;
    }
    .divider {
      position: absolute;
      left: 288px;
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      flex-basis: 28px;
    }
  }
}
</style>
