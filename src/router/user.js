const { loginCheck } = require('./../controller/user')
const { SuccessModel, ErrorModel } = require('./../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        const result = loginCheck(username, password)
        console.log("🚀 ~ file: user.js ~ line 9 ~ handleUserRouter ~ result", result)
        // if (result) {
        //     return new SuccessModel()
        // } else {
        //     return new ErrorModel('账号密码错误，登录失败')
        // }
        return result.then(data => {
            if (data.username) {
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }
}

module.exports = handleUserRouter