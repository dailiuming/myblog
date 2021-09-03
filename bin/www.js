const http = require('http');
const serverHandle = require('./../app.js')
const RORT = 3000
const server = http.createServer(serverHandle)

server.listen(RORT, () => {
    console.log('3000服务启动成功')
})