import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            count:Number,
            color:String
        }
    ],
    paymentIntent:{},
    orderStatus:{
        type:String,
        default:"Not Processed",
        enum:[
            "Not Processed",
            "Cash on Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered"
        ]
    },
    orderby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
},{
    timestamps:true
});

const orderModel = mongoose.models.orders || mongoose.model("orders",orderSchema);

export default orderModel;

