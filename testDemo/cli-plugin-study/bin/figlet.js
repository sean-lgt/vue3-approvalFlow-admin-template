const figlet = require('figlet')

figlet('hello VUE', (err, data) => {
  if (err) {
    console.log('πγεΊη°ιθ――δΊγ', err)
    return
  }
  console.log('π', data);
})
