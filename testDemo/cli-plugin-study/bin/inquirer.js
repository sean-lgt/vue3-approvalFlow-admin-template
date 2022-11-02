const inquirer = require('inquirer')

inquirer.prompt([{
  name: '请输入您的项目名'
}]).then((answers) => {
  console.log('🚀【你的项目名为】', answers);
}).catch(error => {
  console.log('💔【出现异常】', error);
})
