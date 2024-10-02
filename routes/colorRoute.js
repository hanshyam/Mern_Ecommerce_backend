import express from "express";
import {
  createColor,
  updateColor,
  deleteColor,
  getAllColor,
  getaColor,
} from "../controllers/colorController.js";
import { isAdmin, validateToken } from "../middleware/validateTokenHandler.js";

const router = express.Router();

router.post("/", validateToken, isAdmin, createColor);
router.put("/:id", validateToken, isAdmin, updateColor);
router.delete("/:id", validateToken, isAdmin, deleteColor);
router.get("/", getAllColor);
router.get("/:id", getaColor);

export default router;
