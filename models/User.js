const mongoose=require('mongoose')

const UserSchema=mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String, required: true, unique:true},
    password:{type:String ,required:true},
    role:{type:String, enum:['1','2','3'], default:'3'},
    image:{type:String},
    rating:{type:Number, default:0},
    info:{type:String},
    data:{type:Date, default: Date.now()},
})

module.exports=mongoose.model('User', UserSchema)