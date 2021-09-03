const querystring = require('querystring');
const handleBlogRouter = require('./src/router/bolg');
const handleUserRouter = require('./src/router/user');
const { access } = require('./src/utils/log')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d', d.toGMTString())
    return d.toGMTString()
}

// session数据
const SESSION_DATA = {}

// 获取post方法参数
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            return resolve({})
        }

        if (req.headers['content-type'] !== 'application/json') {
            return resolve({})
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk
        })
        req.on('end', () => {
            if (!postData) {
                return resolve({})
            }
            resolve(JSON.parse(postData))
        })

    })
}

const serverHandle = (req, res) => {
    // 记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    //  process.env.NODE_ENV
    // 设置返回格式
    res.setHeader("Content-type", "application/json")

    // 获取path
    const url = req.url
    req.path = url.split('?')[0]
    //  stringObject.split(separator,howmany)   join()  将数组变成字符串  [1,2,3,4]  arrayObject.join("--") "1--2--3--4"
    // splice() splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。   arrayObject.splice(index,howmany,item1,.....,itemX)
    // slice() 方法可从已有的数组中返回选定的元素。 arrayObject.slice(start,end)

    // 解析query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const value = arr[1].trim()
        req.cookie[key] = value
    });

    // 解析session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    // 处理postData
    getPostData(req).then(postData => {
        req.body = postData

        // blog路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    // 操作cookie | path=/ 设置成为根路由生效 | httpOnly=>禁止前端修改cookie | expires设置过期时间
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        // user路由
        const userData = handleUserRouter(req, res)
        if (userData) {
            userData.then(userData => {
                if (needSetCookie) {
                    // 操作cookie | path=/ 设置成为根路由生效 | httpOnly=>禁止前端修改cookie | expires设置过期时间
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }

        // 未命中
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write('404 Not Found\n')
        res.end()
    })


}

module.exports = serverHandle