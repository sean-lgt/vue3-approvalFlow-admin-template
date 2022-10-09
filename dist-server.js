const server = require('pushstate-server')

server.start({
  port: 4007,
  directory: './dist'
})
