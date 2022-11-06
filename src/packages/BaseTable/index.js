import BaseTable from "./BaseTable.vue";

// 注册组件
BaseTable.install = (app) => {
  app.component(BaseTable.name, BaseTable)
}

export default BaseTable
