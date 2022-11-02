const { program } = require('commander')

// 设置版本
program.version('1.1.0')

program.option('-t --test', '这是一个测试')
program.option('-n --name <type>', 'output name')

program.command('create <app-name>')
program.description('创建项目')
program.action(name => {
  console.log('🚀【此处打印】', name);
  console.log('🚀【正在创建项目】', );
})

program.parse(process.argv)
