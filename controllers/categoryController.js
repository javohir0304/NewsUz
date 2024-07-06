const Category=require('../models/Category')

exports.add=(req,res)=>{
    const category=new Category({
        name: req.body.name
    })

    category.save()
        .then(()=>{
            res.status(200).json({
                success: true,
                category
            })
        })
        .catch((error)=>{
            res.status(400).json({
                success:false,
                data: error
            })
        })
}
exports.getAllCategory= async (req,res)=>{
    const category= await Category.find()
    res.status(200).json({
        success: true,
        data: category
    })
}
exports.getCategoryById=async (req,res)=>{
    const category=await Category.findById({_id:req.params.id})
    res.status(200).json({
        success:true,
        data: category
    })

}
exports.deleteCategoryById=async (req,res)=>{
    await Category.findByIdAndDelete({_id:req.params.id})
    res.status(200).json({
        succes:true,
        gata:[]
    })
}
exports.updateCategoryById=async (req,res)=>{
    const category=await Category.findByIdAndUpdate({_id:req.params.id})
    category.name=req.body.name

    category.save()
        .then(()=>{
            res.status(200).json({
                success: true,
                data:category
            })
        })
        .catch((error)=>{
            res.status(400).json({
                success:true,
                error
            })
        })
}
