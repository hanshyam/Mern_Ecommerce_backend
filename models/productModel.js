import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
     title:{
        type:String,
        required:true,
        trim:true,
     },
     slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
     },
     description:{
        type:String,
        required:true, 
     },
     price:{
        type:Number,
        required:true
     },
     category: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref:"Category"
      type:String,
      required:true
     },
     brand: {
      type:String,
      required:true
     },
     quantity: {
      type:Number,
      required:true
     },
     sold:{
        type:Number,
        default:0
     },
     images:{
        type: Array,
     },
     color:[],
     tags:[],
     ratings: [{
        star:Number,
        comment:String,
        postedBy:{type:mongoose.Schema.Types.ObjectId, ref:"users"}
     }],
     totalratings:{
       type:String,
       default: 0,
     }
     
},{timestamps:true});

const productModel = mongoose.models.products || mongoose.model("products",productSchema);

export default productModel;