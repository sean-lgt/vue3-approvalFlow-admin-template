/*
 * 自定义脚手架，快发生成vue后台框架
 */
const { promisify } = require('util')
const { program } = require('commander')
// TypeError: next is not a function
// const asyncFiglet = promisify(require('figlet'))
const figlet = require('figlet')
const chalk = require('chalk')
const inquirer = require('inquirer')
const gitDownload = require('./init')


// 设置版本和参数
program.version('1.0.0')
program.option('-n --name <type>', 'output name')

const asyncFiglet = (content) => {
  return new Promise((resolve, reject) => {
    figlet(content, (err, data) => {
      if (err) {
        console.log('💔【出现错误了】', err)
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

// 日志打印函数
const log = content => console.log(chalk.yellow(content))

// 打印logo
const printLogo = async (content) => {
  const data = await asyncFiglet(content)
  log(data)
}

// 命令行
program.command('create <app-name>')
  .description('创建项目名')
  .action(async (name) => {
    await printLogo('VUE-CLI')
    log('准备创建项目~~~')
    let answer = await inquirer.prompt([{
      name: 'language',
      type: 'list',
      message: '请选择语言版本',
      choices: ['JavaScript', 'TypeScript']
    }])
    if (answer.language == 'JavaScript') {
      log('您选择了【JavaScript】版本，即将进入下载')
      gitDownload(name)
    } else {
      log('暂未开放敬请期待')
    }
  })



// 参数解析
program.parse(process.argv)
