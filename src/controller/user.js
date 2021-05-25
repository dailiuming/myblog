const { exec } = require('./../db/mysql')
const loginCheck = (username, password) => {
    // 假数据验证登录
    // if (username === 'zhangsan' && password === '123') {
    //     return true
    // }
    // return false

    const sql = `select username, realname from users where username='${username}' and password='${password}'`

    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

module.exports = {
    loginCheck
}