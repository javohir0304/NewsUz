const express=require('express')
const app=express()
const pathus=require('path').join(__dirname, '/public/uploads/avatars')
const pathnews=require('path').join(__dirname, '/public/uploads/newsfile')
const newsRouter=require('./routes/news')
const categoryRouter=require('./routes/category')
const userRouter=require('./routes/user')
const bodyparser=require('body-parser')
const connectDB=require('./config/db')

    connectDB();
app.use(bodyparser.json())


app.use('/user',userRouter)
app.use('/public/uploads/avatars', express.static(pathus))
app.use('/news',newsRouter)
app.use('/category',categoryRouter)
app.use('/public/uploads/newsfile', express.static(pathnews))

const PORT=4000;
app.listen(PORT,()=>{
    console.log(`Server ${PORT} da ishga tushdi`)
})