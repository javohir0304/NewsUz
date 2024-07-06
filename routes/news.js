const express=require('express')
const router=express.Router()
const multer=require('multer')
const md5=require('md5')
const path=require('path')
const {protect, authorize}=require('../middlewares/author')
const {add,
    getAllNews,
    getNewsById,
    deleteFile,
    updateNewsById
}=require('../controllers/newsController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/newsfile' )
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage })

router.post('/add',upload.single('file'),protect,authorize,add)
router.get('/all',getAllNews)
router.get('/:id',getNewsById)
router.delete('/:id',deleteFile,protect, authorize)
router.put('/:id',updateNewsById, protect, authorize)

module.exports=router


