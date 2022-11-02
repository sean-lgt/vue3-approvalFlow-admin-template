const figlet = require('figlet')

figlet('hello VUE', (err, data) => {
  if (err) {
    console.log('💔【出现错误了】', err)
    return
  }
  console.log('🚀', data);
})
