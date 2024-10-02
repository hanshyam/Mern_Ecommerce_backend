import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index: true
    },
},{
    timestamps:true,
})

const productCategoryModel = mongoose.models.productCategory || mongoose.model("productCategory",categorySchema);

export default productCategoryModel; 