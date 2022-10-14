/**
 * 项目环境变量配置
 */
const ENV =
  import.meta.env.MODE || 'prod'

const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://console-mock.apipost.cn/mock/ab97aa82-b276-42e3-a604-217185449c97/api',
    mockApipostId: '977497',
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api'
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api'
  }
}


export default {
  ENV,
  mock: false,
  namespace: 'mangaer',
  ...EnvConfig[ENV]
}
