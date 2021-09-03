const { exec } = require('./../db/mysql')
const xss = require('xss');

const getList = (author, keyword) => {
    let sql = `select id, title, content, createTime, author from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}'`
    }
    if (keyword) {
        sql += `and title like '%${keyword}%'`
    }
    sql += `order by createTime desc`
    return exec(sql)
}

const getDetail = id => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    
    // const { title, content, author } = blogData
    const createTime = Date.now()

    let sql = `INSERT INTO blogs (title,content,createtime,author) values ('${title}','${content}','${createTime}','${author}')`
    return exec(sql).then(insertData => {
        // console.log("🚀 ~ file: blog.js ~ line 28 ~ returnexec ~ insertData", insertData)
        return insertData.insertId
    })
}

const updateBlog = (id, blogData = {}) => {
    // id 更新的博客id
    // blogData 更新的博客内容
    const { title, content } = blogData
    const createTime = Date.now()
    const sql = `UPDATE blogs SET title='${title}', content='${content}', createtime='${createTime}' WHERE id='${id}'`

    return exec(sql).then(updateData => {
        if (updateData.changedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    const sql = `delete from blogs where id=${id} and author='${author}'`
    return exec(sql).then(delData => {
        console.log("🚀 ~ file: blog.js ~ line 51 ~ returnexec ~ delData", delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}


module.exports = {
    getList, getDetail, newBlog, updateBlog, delBlog
}