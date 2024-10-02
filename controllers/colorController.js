import colorModel from "../models/colorModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoId.js";

// creating the Color
const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await colorModel.create(req.body);
    res.json({ newColor });
  } catch (error) {
    throw new Error(error);
  }
});

// updating the Color
const updateColor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedColor = await colorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ updatedColor });
  } catch (error) {
    throw new Error(error);
  }
});

// deleting the Color
const deleteColor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deletedColor = await colorModel.findByIdAndDelete(id);
    res.json({ deletedColor });
  } catch (error) {
    throw new Error(error);
  }
});

// get a the Color
const getaColor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const Color = await colorModel.findById(id);
    res.json({ Color });
  } catch (error) {
    throw new Error(error);
  }
});

// geting all the Color
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const Colors = await colorModel.find();
    res.json({ Colors });
  } catch (error) {
    throw new Error(error);
  }
});

export { createColor, updateColor, deleteColor, getAllColor, getaColor };
