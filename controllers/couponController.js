import couponModel from "../models/couponModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoId.js";

// creating the Coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await couponModel.create(req.body);
    res.json({ newCoupon });
  } catch (error) {
    throw new Error(error);
  }
});

// updating the Coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// deleting the Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deletedCoupon = await couponModel.findByIdAndDelete(id);
    res.json(deletedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});


// geting all the Coupon
const getAllCoupon = asyncHandler(async (req, res) => {
  try {
    const Coupons = await couponModel.find();
    res.json(Coupons);
  } catch (error) {
    throw new Error(error);
  }
});

export { createCoupon, updateCoupon, deleteCoupon, getAllCoupon };
