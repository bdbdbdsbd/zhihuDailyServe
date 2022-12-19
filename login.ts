module.exports = (app:any) => {
    const router = require('express').Router()
    const mysql = require('mysql')
    const crypto = require('crypto')

    const jwt = require('jsonwebtoken')  //加密的包,对象转token
    const expressJWT = require('express-jwt')  //解密的包  token转对象
    const secret = 'bdbd'  //加密解密秘钥
    const db = mysql.createPool({
        host:'127.0.0.1',
        user:'root',
        password:'meiziziya123A',
        database:'zhihu',
    })

    const sqlSelectUser = 'select user_name,password from user where user_id=?'
    const sqlInsertUser = 'INSERT INTO user SET ?'


    router.post('/register',(req:any ,res:any )=>{
        db.query(sqlSelectUser,req.body.user_id,(err:any, results:any)=>{
            if(err) return console.log(err.message,req.body.user_id)
            if(results.length==0){
                const hash = crypto.createHash('sha256')//相当于创建了一个模板
                hash.update(req.body.password)
                const cryptoMessage = {
                    user_id:req.body.user_id,
                    password:hash.digest('hex')
                }
                db.query(sqlInsertUser,cryptoMessage,(err:any, results:any)=>{
                    if(results.length!=0){
                        res.send(({'status':0,msg:'注册成功'}))
                    }else{
                        res.send(({'status':1,msg:'注册失败'}))
                    }
                })
            }else{
                res.send(({'status':1,msg:`用户已经存在，姓名 ${results[0].user_name}`}))
            }
        })        
    })


    router.post('/login',(req:any,res:any )=>{
        // console.log(req.body.user_id)
        db.query(sqlSelectUser,req.body.user_id,(err:any,results:any)=>{
            // console.log(results)
            if(results.length==0){
                res.send({
                    status:0,
                    message:'请输入正确的用户名或密码',
                })
            }
            const hash = crypto.createHash('sha256')//相当于创建了一个模板
            hash.update(req.body.password)
            
            if(results[0].password==hash.digest('hex')){
                const tokanStr = jwt.sign({
                    user_id:req.body.user_id, 
                },secret,{ algorithm: 'HS256'},{expiresIn:'86400s'})
                res.send({
                    status:200,
                    message:'登陆成功',
                    token:tokanStr
                })
            }
        })
    })

    app.use('/user',router)
    // 这个顺序也有讲究，JWT要放在最后面
    // 要加Bearer
    app.use((expressJWT.expressjwt({secret:"bdbd",algorithms: ["HS256"]})).unless({path:[/^\/user\//]}))
    app.use((err:any,req:any,res:any,next:any)=>{
        if(err.name=='UnauthorizedError'){
            return res.send({
                status:401,
                message:'无效的token'
            })
        }
        next()
    })
    

}