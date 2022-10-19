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

// 获取菜单列表
export const menuListApi = (params = {}) => {
  return request({
    url: '/menu/list',
    method: 'get',
    data: params,
    mock: true,
    mockApipostId: '34507f'
  })
}

// 获取用户列表
export const userListApi = (params = {}) => {
  return request({
    url: '/users/list',
    method: 'get',
    data: params,
    mock: true,
    mockApipostId: 'e9e863'
  })
}

// 用户列表删除接口
export const userDelApi = (params) => {
  return request({
    url: '/users/delete',
    method: 'post',
    data: params,
    mock: true,
    mockApipostId: '96c75e'
  })
}
