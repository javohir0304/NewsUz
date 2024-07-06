const mongoose=require('mongoose')

const NewsSchema=mongoose.Schema({
    title: {type: String, required:true},
    category:{
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {type: String, required: true},
    file:{type:String, required:true},
    date: {type:Date, default:Date.now()}
})
module.exports=mongoose.model('News',NewsSchema)
