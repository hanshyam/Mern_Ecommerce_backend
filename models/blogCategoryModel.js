import mongoose from 'mongoose';

const blogCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
});

const blogCategoryModel = mongoose.models.blogCategories || mongoose.model("blogCategories",blogCategorySchema);

export default blogCategoryModel;