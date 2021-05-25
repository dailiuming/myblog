const http = require('http');

const PORT = 3001
const serverHandle = require('../app')

const server = http.createServer(serverHandle)
server.listen(PORT, () => {
    console.log(`${PORT} 启动成功~`);
})