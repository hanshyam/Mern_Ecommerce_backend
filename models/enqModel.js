import mongoose from "mongoose";
const enqSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "First Name is compulsory"]
    },
    email: {
        type: String,
        required: [true, "Email is compulsory"],
    },
    phone: {
        type: String,
        required: [true, "Phone is compulsory"],
    },
    comment:{
        type:String,
        required:[true, "Comment is compulsory"]
    },
    status:{
        type:String,
        default:"Submitted",
        enum:["Submitted","Contacted","In Progress"]
    }
});

const enqModel = mongoose.model.enquiries || mongoose.model("enquiries",enqSchema);

export default enqModel;