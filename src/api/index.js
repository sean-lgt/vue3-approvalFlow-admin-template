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
    mock: false,
    mockApipostId: '34507f'
  })
}

// 获取用户列表
export const userListApi = (params = {}) => {
  return request({
    url: '/users/list',
    method: 'get',
    data: params,
    mock: false,
    mockApipostId: 'e9e863'
  })
}

// 用户列表删除接口
export const userDelApi = (params) => {
  return request({
    url: '/users/delete',
    method: 'post',
    data: params,
    mock: false,
    mockApipostId: '96c75e'
  })
}

// 所有角色名称列表
export const roleAllListApi = () => {
  return request({
    url: '/roles/allList',
    method: 'get',
    data: {},
    mock: true,
    mockApipostId: '5bb5f5'
  })
}

// 部门名称列表
export const deptAllListApi = () => {
  return request({
    url: '/dept/allList',
    method: 'get',
    data: {},
    mock: true,
    mockApipostId: '633e51'
  })
}

// 确认提交新增用户
export const addUserApi = (params) => {
  return request({
    url: '/users/operate',
    method: 'post',
    data: params,
    mock: false,
    mockApipostId: '40e96b'
  })
}

// 确认提交菜单管理信息
export const menuOperateApi = (params) => {
  return request({
    url: '/menu/operate',
    method: 'post',
    data: params,
    mock: false,
    mockApipostId: '6b4fbb'
  })
}

// 获取角色列表
export const roleListApi = (params = {}) => {
  return request({
    url: '/roles/list',
    method: 'get',
    data: params,
    mock: true,
    mockApipostId: 'a99d81'
  })
}

// 角色相关操作 增加、编辑、删除
export const roleOperateApi = (params = {}) => {
  return request({
    url: '/roles/operate',
    method: 'post',
    data: params,
    mock: true,
    mockApipostId: 'c9c33c'
  })
}

// mock 菜单列表 获取按钮及菜单权限
// 获取菜单列表
export const menuListMockApi = (params = {}) => {
  return request({
    url: '/menu/list',
    method: 'get',
    data: params,
    mock: true,
    mockApipostId: '34507f'
  })
}

// 角色权限操作
export const rolePermissionApi = (params = {}) => {
  return request({
    url: '/roles/update/permission',
    method: 'post',
    data: params,
    mock: true,
    mockApipostId: '693374'
  })
};


// 部门列表数据，可查询
export const deptListApi = (params = {}) => {
  return request({
    url: '/dept/list',
    method: 'get',
    data: params,
    mock: true,
    mockApipostId: 'f69edb'
  })
}
