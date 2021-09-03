const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV

// 生成write stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a',   //  a: 追加 w:覆盖
    })
    return writeStream
}

// 写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')   //  写入内容
}

// 
const accessWriteSteam = createWriteStream('access.log')
function access(log) {
    // 线上环境 写日志
    if (env === 'production') {
        writeLog(accessWriteSteam, log)
    }
    // 开发环境 直接打印在控制台
    if (env === 'dev') {
        writeLog(accessWriteSteam, log)
        // console.log(log)
    }
}

module.exports = {
    access
}
