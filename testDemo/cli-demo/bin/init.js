const chalk = require('chalk')
const download = require('download-git-repo')
const shell = require('shelljs')
const ora = require('ora')

// 日志打印函数
const log = content => console.log(chalk.yellow(content))

const asyncdDownload = (gitUrl, appName, isClone) => {
  return new Promise((resolve, reject) => {
    download(gitUrl, appName, { clone: isClone }, function(err) {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  })
}

const gitDownload = async (appName) => {
  log('🚀~准备创建项目')
  shell.rm('-rf', appName)
  const spinner = ora('下载中~~~').start()
  try {
    await asyncdDownload('direct:https://github.com/sean-lgt/vue3-approvalFlow-admin-template.git', appName, true)
    spinner.succeed('👌下载完成')
    log(`
      请执行下面命令启动项目：
      -------------------------------
       1️⃣ : cd ${appName}
       2️⃣ : npm install
       3️⃣ : npm run serve
    `)
  } catch (error) {
    log(`😒下载失败了，错误信息：${error}`)
    spinner.stop()
  }
}

module.exports = gitDownload
