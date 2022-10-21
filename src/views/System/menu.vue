<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="queryFormRef" inline :model="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1 + ''" label="正常"></el-option>
            <el-option :value="2 + ''" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
          <el-button @click="handleResetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
      </div>
      <el-table
        :data="menuList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formater"
        ></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              @click="handleAdd(2, scope.row)"
              type="primary"
              size="mini"
              >新增</el-button
            >
            <el-button @click="handleEdit(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="用户新增" v-model="showModal">
      <el-form
        ref="dialogFormRef"
        :model="menuForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span style="margin-left: 6px">不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.icon" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuForm.menuType == 2"
        >
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="menuState"
          v-show="menuForm.menuType == 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
import { reactive, ref } from 'vue'
import utils from '../../utils/utils'

const queryFormRef = ref() //查询实例
const queryForm = reactive({
  menuName: '',
  menuState: '1'
})
const menuList = ref([]) //列表数据
const columns = [
  {
    label: '菜单名称',
    prop: 'menuName',
    width: 150
  },
  {
    label: '图标',
    prop: 'icon'
  },
  {
    label: '菜单类型',
    prop: 'menuType',
    formatter(row, column, value) {
      return {
        1: '菜单',
        2: '按钮'
      }[value]
    }
  },
  {
    label: '权限标识',
    prop: 'menuCode'
  },
  {
    label: '路由地址',
    prop: 'path'
  },
  {
    label: '组件路径',
    prop: 'component'
  },
  {
    label: '菜单状态',
    prop: 'menuState',
    width: 90,
    formatter(row, column, value) {
      return {
        1: '正常',
        2: '停用'
      }[value]
    }
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  }
]

// 重置查询
const handleResetSearch = () => {
  if (!queryFormRef.value) return
  queryFormRef.value.resetFields()
}

// 表单填写
const showModal = ref(false)
const action = ref('')
const dialogFormRef = ref()
const menuForm = reactive({
  parentId: [null],
  menuType: 1,
  menuName: '',
  icon: '',
  path: '',
  menuCode: '',
  component: '',
  menuState: 1
})
const rules = {
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 10,
      message: '长度在2-8个字符',
      trigger: 'blur'
    }
  ]
}

// 新增菜单
const handleAdd = (type, row) => {
  showModal.value = true
  action.value = 'add'
}

// 关闭菜单
const handleClose = () => {
  showModal.value = false
  dialogFormRef.value.resetFields()
}

// 点击确定
const handleSubmit = async () => {
  if (!dialogFormRef.value) return
  await dialogFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      //  校验成功 可以提交
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped></style>
