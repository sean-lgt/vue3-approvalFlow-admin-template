const { program } = require('commander')

// 设置版本
program.version('1.1.0')

program.option('-t --test', '这是一个测试')

program.action(name => {
  console.log('🚀【此处打印】', name);
})

program.parse(process.argv)
