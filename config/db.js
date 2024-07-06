const mongoose=require('mongoose');

const dbUri='mongodb://localhost:27017/malumot_db'
const connectDb=async ()=>{
    const conn=await mongoose.connect(dbUri,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log(`mongodb ${conn.connection.host} ga  ulandi`)
}

module.exports=connectDb