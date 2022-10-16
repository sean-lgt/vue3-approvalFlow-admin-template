/**
 * axios 请求二次封装
 **/

import axios from 'axios'
import projectConfig from '@/config'
import { ElMessage } from 'element-plus'
import router from '@/router'

const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常,请稍后重试'

// 创建axios实例对象，创建全局配置
const service = axios.create({
  baseURL: projectConfig.baseApi,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  const headers = req.headers
  const { token } = localStorage.getItem('userInfo') || {}
  console.log('请求数据', req)
  console.log('请求数据', projectConfig)
  if (req.mock) {
    if (!req.params) {
      req.params = {}
    }
    req.params['apipost_id'] = req.mockApipostId || null //mock请求
  }
  if (!headers.Authorization) {
    headers.Authorization = 'Bearer ' + token
    return req
  }
})

// 请求拦截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return Promise.resolve(data)
  } else if (code === 500001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      // 调回登录页
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * @description: 请求核心函数
 * @return {*}
 * @param {*} options  请求配置
 */
const request = (options) => {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  let isMock = projectConfig.mock
  if (typeof options.mock != 'undefined') {
    isMock = options.mock
  }
  if (projectConfig.ENV === 'prod') {
    // 防止生产环境调用mock
    service.defaults.baseURL = projectConfig.baseApi
  } else {
    // 判断是否要启用 mock
    service.defaults.baseURL = isMock
      ? projectConfig.mockApi
      : projectConfig.baseApi
  }

  return service(options)
}

// 注册 request 快捷方式
;['get', 'post', 'put', 'delete', 'patch'].forEach((reqType) => {
  request[reqType] = (url, data, options) => {
    return request({
      url,
      data,
      method: reqType,
      ...options // 其他自定义配置
    })
  }
})

export default request
