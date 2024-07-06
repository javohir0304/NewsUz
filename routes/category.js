const express=require('express')
const routercat=express.Router()
const {add,
     getAllCategory,
     getCategoryById,
     deleteCategoryById,
     updateCategoryById
}=require('../controllers/categoryController')
const { protect, authorize } = require('../middlewares/author')

routercat.post('/add', protect, authorize, add)
routercat.get('/all',getAllCategory)
routercat.get('/:id',getCategoryById)
routercat.delete('/:id', protect, authorize,deleteCategoryById)
routercat.put('/:id', protect, authorize,updateCategoryById)


module.exports=routercat