import productModel from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import validateMongoDbId from '../utils/validateMongoId.js';
import userModel from '../models/userModel.js';
import {cloudinaryUploadImg,cloudinaryDeleteImg} from '../utils/cloudinary.js';
import fs from 'fs';

// create a product
const createProduct = asyncHandler (async(req,res)=>{
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    const newProduct = await productModel.create(req.body);
    res.json({newProduct});

})

// update product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Generate a slug if title is being updated
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        // Update the product by its MongoDB _id
        const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            res.status(404);
            throw new Error("Product not found");
        }

        // Return the updated product
        res.json(updatedProduct);

    } catch (error) {
        res.status(500);
        throw new Error(error.message || "Something went wrong while updating the product");
    }
});


// delete product
const deleteProduct = asyncHandler( async (req,res)=>{
    const { id } = req.params;
   try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    res.json(deletedProduct);

   } catch (error) {
      throw new Error(error);
   }
})


// get a product
const getProduct = asyncHandler( async (req,res)=>{
    const id = req.params.id;
    const product = await productModel.findById(id);

    if(!product){
        throw new Error("Product does not exist");
    }
    res.json(product);
})

// get all product
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = productModel.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(' ');
            query = query.sort(sortBy); 
        } else {
            query = query.sort("-createdAt");
        }

        // Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(' ');
            query = query.select(fields);  
        } else {
            query = query.select("-__v");
        }

        // Pagination with defaults
        const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 5; // Default to limit 5 if not provided
        const skip = (page - 1) * limit;

        // Log for troubleshooting
        console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

        // Apply pagination
        query = query.skip(skip).limit(limit);

        // Execute the query with pagination
        const products = await query;

        // Handle page overflow
        const totalProducts = await productModel.countDocuments();
        if (skip >= totalProducts) {
            return res.status(400).json({ message: "This page does not exist" });
        }
        res.json(products);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// add ratings
const addRatings = asyncHandler(async (req, res) => {
    const { id } = req?.user; // User's ID from the authenticated request
    const { stars,comment, prodId } = req.body; // Extract stars and product ID from the request body

    try {
        // Find the product by ID
        const product = await productModel.findById(prodId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product was already rated by this user
        const isRatedAlready = product.ratings.find(
            (rating) => rating.postedBy.toString() === id.toString()
        );

        if (isRatedAlready) {
            // If already rated, update the rating
           await productModel.updateOne(
                { _id: prodId, 'ratings.postedBy': id },
                { $set: { 'ratings.$.star': stars,'ratings.$.comment': comment } },
            );
        } else {
            // Add the new rating to the product's ratings array
            product.ratings.push({
                star: stars,
                comment:comment,
                postedBy: id
            });
        }

        // Save the updated product
        await product.save();
        const ratedProduct = await productModel.findById(prodId);
        // res.status(200).json({ message: "Rating added", ratedProduct });

        const totalRatings = ratedProduct.ratings.length;
        const ratingSum = ratedProduct.ratings.map(item => item.star).reduce((prev,curr)=>prev + curr,0);
        const actualRating = Math.round(ratingSum/totalRatings);
        const finalProduct = await productModel.findByIdAndUpdate(prodId,{
            totalratings:actualRating
        },{new:true})
        
        res.json(finalProduct);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const uploadImages = asyncHandler( async(req,res)=>{
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

export {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addRatings,
    uploadImages,
    deleteImages
};