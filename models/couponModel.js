import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase:true,
        unique:true
    },
    expiry:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
});
const couponModel = mongoose.models.coupons || mongoose.model("coupons",couponSchema);

export default couponModel;