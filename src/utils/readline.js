const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')

// 创建read stream
const readSteam = fs.createReadStream(fileName)

// 创建readline对象
const rl = readline.createInterface({
    input: readSteam
})

let chromeNum = 0
let sumNum = 0

rl.on('line', (lineData) => {
    if (!lineData) return

    sumNum++
    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        chromeNum++
    }
})

// 监听完成
rl.on('close',()=> {
    console.log(`chrome占比 ${(chromeNum/sumNum)}`);
})
