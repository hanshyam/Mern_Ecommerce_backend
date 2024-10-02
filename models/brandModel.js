import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index: true
    },
},{
    timestamps:true,
})

const brandModel = mongoose.models.brands || mongoose.model("brands",brandSchema);

export default brandModel; 