import enqModel from "../models/enqModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoId.js";

// creating the Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await enqModel.create(req.body);
    res.json({ newEnquiry });
  } catch (error) {
    throw new Error(error);
  }
});

// updating the Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedEnquiry = await enqModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ updatedEnquiry });
  } catch (error) {
    throw new Error(error);
  }
});

// deleting the Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deletedEnquiry = await enqModel.findByIdAndDelete(id);
    res.json({ deletedEnquiry });
  } catch (error) {
    throw new Error(error);
  }
});

// get a the Enquiry
const getaEnquiry = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const Enquiry = await enqModel.findById(id);
    res.json({ Enquiry });
  } catch (error) {
    throw new Error(error);
  }
});

// geting all the Enquiry
const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const Enquirys = await enqModel.find();
    res.json({ Enquirys });
  } catch (error) {
    throw new Error(error);
  }
});

export { createEnquiry, updateEnquiry, deleteEnquiry, getAllEnquiry, getaEnquiry };
