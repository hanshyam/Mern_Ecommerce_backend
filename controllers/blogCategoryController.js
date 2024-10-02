import blogCategoryModel from "../models/blogCategoryModel.js";
import asyncHandler from "express-async-handler";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await blogCategoryModel.create(req.body);
    res.json({ newCategory });
  } catch (error) {
    throw new Error(error);
  }
});

// updating the category
const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedCategory = await blogCategoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json({ updatedCategory });
  } catch (error) {
    throw new Error(error);
  }
});

// deleting the category
const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deletedCategory = await blogCategoryModel.findByIdAndDelete(id);
    res.json({ deletedCategory });
  } catch (error) {
    throw new Error(error);
  }
});

// get a the category
const getaCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const category = await blogCategoryModel.findById(id);
    res.json({ category });
  } catch (error) {
    throw new Error(error);
  }
});

// geting all the category
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await blogCategoryModel.find();
    res.json({ categories });
  } catch (error) {
    throw new Error(error);
  }
});

export { createCategory, updateCategory, deleteCategory, getAllCategory, getaCategory };
