import QueryForm from "./QueryForm.vue"

// 注册组件
QueryForm.install = (app) => {
  app.component(QueryForm.name, QueryForm)
}

export default QueryForm
