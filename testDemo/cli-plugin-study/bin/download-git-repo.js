const download = require('download-git-repo')

download('https://github.com/sean-lgt/vue3-approvalFlow-admin-template.git', 'test/tmp', { clone: true }, function(err) {
  console.log(err ? 'Error' : 'Success')
})
