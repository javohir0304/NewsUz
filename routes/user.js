const express=require('express')
const router=express.Router()
const multer=require('multer')
const md5=require('md5')
const path=require('path')
const {protect, authorize}=require('../middlewares/author')
const {register,
      login,
      getMe,
      getAllUser,
      forgetPassword,
      resetPassword,
      biroylik,
      uchoylik,
      allCount
}=require('../controllers/userController')


const storage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, './public/uploads/avatars' )
      },
      filename: function (req, file, cb) {
            cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`)
      }
});

const upload = multer({ storage: storage })

router.post('/register',upload.single('image'),register)
router.post('/login', login)
router.get('/profile',protect, getMe)
router.get('/all',getAllUser, protect,authorize)
router.post('/forgetpassword',protect,forgetPassword)
router.put('/resetpassword/:resettoken',protect,resetPassword)
router.get('/month',authorize,biroylik)
router.get('/month3',authorize,uchoylik)
router.get('/allcount',protect,allCount)


module.exports=router