module.exports = (app:any) => {
    const router = require('express').Router()
    const mysql = require('mysql')
    const db = mysql.createPool({
        host:'127.0.0.1',
        user:'root',
        password:'meiziziya123A',
        database:'zhihu',
    })
    const sqlSelectUser = 'select user_name from user where user_id=?'
    const sqlUpdateUser = 'update user set user_name=?  where user_id=?'
    router.post('/get',(req:any,res:any)=>{
        db.query(sqlSelectUser,req.body.user_id,(err:any, results:any)=>{
            if(err){
                res.send({'status':1,msg:'查询失败'})
            }
            res.send({'status':1,msg:'查询成功',data:{user_name:results[0].user_name}})
        })

    })
    router.post('/set',(req:any,res:any)=>{
        db.query(sqlUpdateUser,[req.body.user_name,req.body.user_id],(err:any, results:any)=>{
            if(err){
                res.send({'status':1,msg:'修改失败'})
            }
            res.send({'status':1,msg:'修改成功',data:{user_name:req.body.user_name}})
        })

    })
    app.use('/userMessage',router)
}