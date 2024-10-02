import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required:true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisliked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
        }
    ],
    dislikes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
        }
    ],
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg?s=612x612&w=0&k=20&c=xR2vOmtg-N6Lo6_I269SoM5PXEVRxlgvKxXUBMeMC_A="
    },
    author: {
        type: String,
        default: 'admin',
    },
    images:[],
},{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
});

const blogModel = mongoose.models.blogs || mongoose.model("blogs",blogSchema);

export default blogModel;