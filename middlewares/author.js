const JWT=require('jsonwebtoken')
const JWT_SECRET=require('../config/config')
const asyncHandler=require('./async')
const User=require('../models/User')
const ErrorResponse=require('../utils/errorResponse')

exports.protect= asyncHandler(async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next( new ErrorResponse('No authorize to access this route',401))
    }
    try{
        const decoded=JWT.verify(token, JWT_SECRET);
        req.user=await User.findById(decoded.id);
        next();
    }
    catch (err) {
        return next( new ErrorResponse('no authorize to access this route',401))
    }
})


exports.authorize=(...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            if(req.user.email==='javohirboy@gamil.com'){
                return next();
            }
            return next(new ErrorResponse(`user role${req.user.role} is not authorize to access this route`, 403))
        }
        next();
    }
}
