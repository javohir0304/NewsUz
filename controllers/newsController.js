const News=require('../models/News')
const Category=require('../models/Category')
const fs=require('fs')
const path=require('path')
const sharp=require('sharp')
const multer=require('multer')
exports.add=(req,res)=>{
    const news=new News({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        file:`/public/uploads/newsfile/${req.file.filename}`
    })

    news.save()
        .then(()=>{
        res.status(200).json({
           success:true,
           data: news
        })
    })
        .catch((error)=>{
        res.status(400).json({
            success: false,
            error
        })
    })
}
exports.getAllNews= async (req,res)=>{
    const news= await News.find()
        .sort({date:-1})
        .populate('Category')
    res.status(200).json({
        success: true,
        data: news
    })
}
exports.getNewsById=async (req,res)=>{
    const news=await News.findById({_id:req.params.id})
    res.status(200).json({
        success: true,
        data: news
    })

}
exports.deleteFile=async (req,res)=>{
    await News.findById(req.params.id)
        .exec((error,data)=>{
            if(error){
                res.send(error)
            }
            else{
                const file=path.join(path.dirname(__dirname)+data.image)
                fs.unlink(file,async (err)=>{
                    if (err) throw res.send(err)

                    await News.findByIdAndDelete(req.params.id)
                    res.status(200).json({
                        success:true,
                        data:[]
                    })
                })
            }
        })
}

exports.updateNewsById=async (req,res)=>{
    await News.findById(req.params.id)
        .exec((error,data)=>{
            if(error){
                res.send(error)
            }
            else{
                const file=path.join(path.dirname(__dirname)+data.file)
                fs.unlink(file,async (err)=>{
                    if (err) throw res.send(err)

                })
            }
        })
    if(req.file) {
        let dataRecords = {
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename,
        }
    } else {
        let dataRecords = {
            title: req.body.title,
            description: req.body.description,
        }

    }
}
// exports.getCategoryNews = async (req, res, next) => {
//     // const category=await Category.findById(req.params.id)
//     // const news =new News;
//     // if(News.categoryId===req.params.id){
//     //     News.aggregate([{$match:{$and:[{$select: 'title'}, {file: true}] }}])
//     //
//     // }
//     // res.status(200).json({
//     //     success:true, data:news
//     // })
//     // const news=await News.aggregate([
//     //     // { $group : { _id: req.params.id } },
//     //     {$match:{$and:[{$select: 'title'}, {file: true}] }}
//     // ])
//
//
//     let id = req.params.id;
//     News.aggregate([ { $match: {categoryID:id}},
//         { $lookup: { from: 'News', localField: 'categoryID', foreignField: 'title', as: 'News' }}],
//         (err, result) => {
//         if(err) { console.error(err); res.sendStatus(400); }
//         else { res.status(200).send(result); } }) }
