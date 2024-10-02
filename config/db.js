import mongoose from "mongoose";

const connectDB = async ()=>{
     await mongoose.connect(process.env.MY_CONNECT_STRING).then(()=>console.log("DB Connected"))
}

export default connectDB;