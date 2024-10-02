import productCategoryModel from "../models/productCategoryModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoId.js";


// creating the category
const createCategory = asyncHandler ( async (req,res)=>{
    try {
        const newCategory = await productCategoryModel.create(req.body);
        res.json({newCategory});
    } catch (error) {
        throw new Error(error);
    }
});


// updating the category
const updateCategory = asyncHandler ( async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const updatedCategory = await productCategoryModel.findByIdAndUpdate(id,req.body,{new:true});
        res.json({updatedCategory});
    } catch (error) {
        throw new Error(error);
    }
});


// deleting the category
const deleteCategory = asyncHandler (async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const deletedCategory = await productCategoryModel.findByIdAndDelete(id);
        res.json({deletedCategory});
    } catch (error) {
        throw new Error(error);
    }
})

// get a the category
const getaCategory = asyncHandler (async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const category = await productCategoryModel.findById(id);
        res.json({category});
    } catch (error) {
        throw new Error(error);
    }
})

// geting all the category
const getAllCategory = asyncHandler (async (req,res)=>{
    try {
        const categories = await productCategoryModel.find();
        res.json({categories});
    } catch (error) {
        throw new Error(error);
    }
}) 

export { createCategory, updateCategory, deleteCategory, getAllCategory, getaCategory };