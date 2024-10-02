import blogModel from "../models/blogModel.js";
import asyncHandler from 'express-async-handler';
import validateMongoDbId from "../utils/validateMongoId.js";
import fs from 'fs';
import {cloudinaryUploadImg,cloudinaryDeleteImg} from "../utils/cloudinary.js";
const createBlog = asyncHandler ( async (req,res)=>{
    try {
        const newBlog = await blogModel.create(req.body);
        res.json({
            status:"success",
            newBlog
        })
    } catch (error) {
        throw new Error(error);
    }
});

// update blog
const updateBlog = asyncHandler( async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const updatedBlog = await blogModel.findByIdAndUpdate(id,req.body,{new:true});
        res.json({updatedBlog});
    } catch (error) {
        throw new Error(error);
    }
})

// get a blog
const getaBlog = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongoDbId(id); // Ensure the blog ID is valid
    
    try {
        // Find the blog by ID and populate the likes and dislikes fields
        const getBlog = await blogModel.findById(id)
            .populate('likes')
            .populate('dislikes');

        // Check if the blog exists
        if (!getBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Increment the numViews field
        getBlog.numViews = getBlog.numViews + 1;
        await getBlog.save();

        // Return the updated blog
        res.json(getBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get all blog
const getAllBlogs = asyncHandler( async (req,res)=>{
    try {
         const blogs = await blogModel.find();
         res.json({blogs});
    } catch (error) {
        throw new Error(error);
    }
});

// delete a blog
const deleteBlog = asyncHandler( async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const blog = await blogModel.findByIdAndDelete(id);
        res.json({message:"Blog deleted successfully",blog});
    } catch (error) {
        throw new Error(error);
        
    }
});

// like a blog
const likeBlog = asyncHandler(async (req, res) => {
    const blogId = req.body.blogId;

    try {
        // Validate blogId
        validateMongoDbId(blogId);

        // Find the blog we want to like or dislike
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if req.user and req.user._id exist
        if (!req?.user || !req?.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Get the login user ID and convert it to string
        const loginUserId = req.user.id.toString();

        // Check if the user has already disliked the post
        const alreadyDisliked = blog.dislikes.find(
            userId => userId.toString() === loginUserId
        );

        // Check if the user has already liked the post
        const alreadyLiked = blog.likes.find(
            userId => userId.toString() === loginUserId
        );

        if (alreadyDisliked) {
            // Remove the user from dislikes and set `isDisliked` to false
            blog.dislikes.pull(loginUserId);
            blog.isDisliked = false;
        }

        if (alreadyLiked) {
            // If already liked, unlike the blog
            blog.likes.pull(loginUserId);
            blog.isLiked = false;
        } else {
            // Otherwise, like the blog
            blog.likes.push(loginUserId);
            blog.isLiked = true;
        }

        // Save the updated blog
        await blog.save();

        // Return the updated blog
        res.json(blog);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// like a blog
const dislikeBlog = asyncHandler(async (req, res) => {
    const blogId = req.body.blogId;

    try {
        // Validate blogId
        validateMongoDbId(blogId);

        // Find the blog we want to like or dislike
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if req.user and req.user._id exist
        if (!req?.user || !req?.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Get the login user ID and convert it to string
        const loginUserId = req.user.id.toString();

        // Check if the user has already disliked the post
        const alreadyDisliked = blog.dislikes.find(
            userId => userId.toString() === loginUserId
        );

        // Check if the user has already liked the post
        const alreadyLiked = blog.likes.find(
            userId => userId.toString() === loginUserId
        );

        if (alreadyDisliked) {
            // Remove the user from dislikes and set `isDisliked` to false
            blog.dislikes.pull(loginUserId);
            blog.isDisliked = false;
        }

        if (alreadyLiked) {
            // If already liked, unlike the blog
            blog.likes.pull(loginUserId);
            blog.isLiked = false;
        } else {
            // Otherwise, like the blog
            blog.dislikes.push(loginUserId);
            blog.isDisliked = true;
        }

        // Save the updated blog
        await blog.save();

        // Return the updated blog
        res.json(blog);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// upload images
const uploadImages= asyncHandler( async(req,res)=>{
    try {
        const uploader = (path) => cloudinaryUploadImg(path,"images");
        const urls = [];
        const files = req.files;
        for(const file of files){
           const {path} = file;
           const newPath = await uploader(path);
           urls.push(newPath);
           fs.unlinkSync(path);
        }
        const images = urls.map((file)=>{
            return file;
        })
        res.json(images);
    } catch (error) {
       throw new Error(error);
    }
})

const deleteImages = asyncHandler( async(req,res)=>{
    const {id } = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id,"images");
        res.json({message:"successfully deleted"});
    } catch (error) {
       throw new Error(error);
    }
})

export {createBlog,updateBlog,getAllBlogs,getaBlog,deleteBlog,likeBlog,dislikeBlog,uploadImages,deleteImages};