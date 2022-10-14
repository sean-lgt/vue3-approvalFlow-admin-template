<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userFormEl" :model="userInfo" status-icon :rules="rules">
        <div class="title">火星</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            :prefix-icon="UserFilled"
            v-model="userInfo.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            :prefix-icon="View"
            v-model="userInfo.userPwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="btn-login"
            @click="handleLogin(userFormEl)"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, View } from '@element-plus/icons-vue'
import { apiLogin } from '../../api'

const router = useRouter()
const userFormEl = ref()

const userInfo = reactive({
  userName: '',
  userPwd: ''
})

const rules = {
  userName: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  userPwd: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
}

// 点击登录
const handleLogin = async (formEl) => {
  console.log('点击登录')
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //  校验成功 可以提交
      console.log('submit!')
      await apiLogin(userInfo)
      router.push('/welcome')
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
