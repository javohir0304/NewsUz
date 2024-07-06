const User = require('../models/User')
const News = require('../models/News')
const Category = require('../models/Category')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const path = require('path')

exports.register = async (req, res, next) => {
    const salt = await bcrypt.genSaltSync(10)
    const password = await bcrypt.hashSync(req.body.password, salt)
    let compressedFile = path.join(__dirname, '../public/uploads/avatar', md5(new Date().getTime()) + '.jpg')
    await sharp(req.file.path)
        .resize(350, 300)
        .jpeg({ quality: 60 })
        .toFile(compressedFile, (error) => {
            if (error) {
                res.send(error)
            }
            fs.unlink(req.file.path, async (error) => {
                if (error) {
                    res.send(error)
                }
            })
        })
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role,
        image: path.basename(compressedFile)

    })

    user.save()
        .then(() => {
            res.status(200).json({
                success: true,
                data: user
            })
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                error
            })
        })
}

/**
 function: logen user
 url: api/user/login
 type: Public
 method: Post
 **/
exports.login = async (req, res, next) => {
    await User.findOne({ email: req.body.email }, (error, user) => {
        if (error) {
            res.send(error)
        }
        else {
            if (!user) {
                res.status(404).json({
                    success: false,
                    data: 'user not found'
                })
            }
            else {
                if (!bcrypt.compareSync(req.body.password, user.password)) {
                    res.status(401).json({
                        success: false,
                        data: 'invalid password'
                    })
                }
                else {
                    let payload = { subject: user._id }
                    console.log(payload)
                    let token = jwt.sign(payload, config.JWT_SECRET)
                    console.log(token)
                    res.status(200).json({
                        token
                    })
                }
            }
        }

    })
}

/**
 function: GET me
 url: api/user/profile
 type: Private
 method:GET
 **/
exports.getMe = async (req, res, next) => {
    const token = req.headers.authorization
    const user = jwt.decode(token.slice(7, token.length))
    const me = await User.findOne({ _id: user.subject })
        .select({ password: 0 })
    res.send(me)
}

exports.getAllUser = async (req, res) => {
    const user = await User.find()
        .sort({ data: -1 })
    res.status(200).json({
        success: true,
        data: user,
    })

}


/**
 function: Forget Password
 url: /api/user/forget
 type: Private
 method: POST
 **/

exports.forgetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        res.status(404).json({
            success: false,
            data: 'User not found'
        })
    }
    // get reset token
    const resetToken = user.getResetPasswordToken();
    console.log(`This is ResetToken: ${resetToken}`) // consolega o`zgartirilgan 40 ta sonli tokenni chiqarib beradi

    await user.save({ validateBeforeSave: false })

    //create reset url
    const resetURL = `http://localhost:3000/api/user/resetpassword/${resetToken}`
    // -----------------------------

    const msg = {
        to: req.body.email,
        subject: 'Parolni tiklash manzili',
        text: `Parolini tiklash uchun bosing ${resetURL}`
        // ${ 40ta sonli resetToken keldi }
    }
    try {
        await sendEmail(msg)
        res.status(200).json({
            success: true,
            data: 'Email sent'
        });
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        res.status(500).json({
            success: false,
            data: 'Email could not be sent'
        })
    }
}

/**
 function: Reset Password
 url: /api/user/resetpassword/:resettoken
 type: PUBLIC
 method: PUT
 **/
exports.resetPassword = async (req, res) => {
    // Yangi parol hashlandi
    const salt = await bcrypt.genSaltSync(12);
    const newHashedPassword = await bcrypt.hashSync(req.body.password, salt);


    // token password olish
    const user = await User.findOneAndUpdate({

        resetPasswordToken: req.params.resettoken
    });
    //foydalanuvchi topilmasa xatolik berish
    if (!user) {
        res.status(400).json({
            success: false,
            data: 'Invalid token'
        })
    }
    //Yangi parolni o'rnatish [heshlangan tarzda chiqadi]
    user.password = newHashedPassword

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    // YAngi parolni saqlash
    await user.save()

    res.status(200).json({
        success: true,
        date: user
    })
}

// Statistika
exports.biroylik = async (req, res) => {
    let currentdate = new Date();
    let lastmonths = new Date(currentdate.setMonth(currentdate.getMonth() - 1))
    const user = await User.aggregate([
        { $match: { $and: [{ data: { $gt: lastmonths, $lt: new Date() } }, { role: "user" }] } }
    ])

    res.status(200).json({
        success: true, count: `all users ${user.length}`
    })

}

exports.uchoylik = async (req, res) => {
    let currentdate = new Date()
    let last3month = new Date(currentdate.setMonth(currentdate.getMonth() - 3))
    const user = await User.aggregate([
        { $match: { $and: [{ data: { $gt: last3month, $lt: new Date() } }, { role: "user" }] } }
    ])
    res.status(200).json({
        success: true, count: `all users ${user.length}`
    })
}


exports.allCount = async (req, res, next) => {
    const user = await User.find().countDocuments()
    const category = await Category.find().countDocuments()
    const news = await News.find().countDocuments()
    res.status(200).json({
        success: true,
        data: `All Users ${user}
         All category${category}
         All news ${news}`
    })
}