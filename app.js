const express =  require('express')
const app = express()


app.use(require('cors')())
app.use(express.static('./dist/test.html'))
app.use(express.json())


require('./login.ts')(app)
require('./user.ts')(app)

app.listen(8088,()=>{
    console.log('8088 is runing')
})