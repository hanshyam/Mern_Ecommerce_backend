import express from "express";
import { createCoupon,updateCoupon,deleteCoupon,getAllCoupon } from "../controllers/couponController.js";
import {validateToken, isAdmin } from "../middleware/validateTokenHandler.js";
const router = express.Router();

router.post("/", validateToken, isAdmin, createCoupon);
router.put("/:id", validateToken, isAdmin, updateCoupon);
router.delete("/:id", validateToken, isAdmin, deleteCoupon);
router.get("/",validateToken,isAdmin,getAllCoupon);
export default router;
