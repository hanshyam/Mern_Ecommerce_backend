import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            count:Number,
            color:String,
            price:Number,
        }
    ],
    cartTotal:Number,
    totalAfterDiscount:Number,
    orderby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
});

const cartModel = mongoose.models.carts || mongoose.model("carts",cartSchema);

export default cartModel;
