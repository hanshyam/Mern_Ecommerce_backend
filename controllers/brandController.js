import brandModel from "../models/brandModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoId.js";


// creating the Brand
const createBrand = asyncHandler ( async (req,res)=>{
    try {
        const newBrand = await brandModel.create(req.body);
        res.json({newBrand});
    } catch (error) {
        throw new Error(error);
    }
});


// updating the Brand
const updateBrand = asyncHandler ( async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const updatedBrand = await brandModel.findByIdAndUpdate(id,req.body,{new:true});
        res.json({updatedBrand});
    } catch (error) {
        throw new Error(error);
    }
});


// deleting the Brand
const deleteBrand = asyncHandler (async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const deletedBrand = await brandModel.findByIdAndDelete(id);
        res.json({deletedBrand});
    } catch (error) {
        throw new Error(error);
    }
})

// get a the Brand
const getaBrand = asyncHandler (async (req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const brand = await brandModel.findById(id);
        res.json({brand});
    } catch (error) {
        throw new Error(error);
    }
})

// geting all the Brand
const getAllBrand = asyncHandler (async (req,res)=>{
    try {
        const brands = await brandModel.find();
        res.json({brands});
    } catch (error) {
        throw new Error(error);
    }
}) 

export { createBrand, updateBrand, deleteBrand, getAllBrand, getaBrand };

