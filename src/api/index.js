/**
 * api 管理
 */

import request from '@/utils/request'

// 测试接口
export const testAxios = (params) => {
  return request({
    url: '/test',
    method: 'get',
    data: params
  })
}

// 登录接口
export const apiLogin = (params) => {
  return request({
    url: '/users/login',
    method: 'post',
    data: params,
    mock: false,
    mockApipostId: '977497'
  })
}

// 获取通知数量接口
export const noticeCountApi = () => {
  return request({
    url: '/leave/count',
    method: 'get',
    data: {},
    mock: true,
    mockApipostId: 'd95875'
  })
}
