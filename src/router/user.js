const { login } = require('./../controller/user')
const { SuccessModel, ErrorModel } = require('./../model/resModel')

// 获取 cookie 的过期时间
const getCookieExpires = () =>{
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d',d.toGMTString())
    return d.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 操作cookie | path=/ 设置成为根路由生效 | httpOnly=>禁止前端修改cookie | expires设置过期时间
                // res.setHeader('Set-Cookie', `username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`)
                //  设置session
                req.session.username = data.username
                req.session.realname = data.realname
                return new SuccessModel()
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }

    // // 登录验证测试
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username) {
    //         return Promise.resolve(
    //             new SuccessModel({ session: req.session.username })
    //         )
    //     }
    //     return Promise.resolve(
    //         new ErrorModel('尚未登录')
    //     )
    // }
}

module.exports = handleUserRouter