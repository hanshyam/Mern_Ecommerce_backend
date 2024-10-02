import express from "express";
import {
  createEnquiry,
  deleteEnquiry,
  getAllEnquiry,
  getaEnquiry,
  updateEnquiry,
} from "../controllers/enqController.js";
import { isAdmin, validateToken } from "../middleware/validateTokenHandler.js";

const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", validateToken,isAdmin, updateEnquiry);
router.delete("/:id", validateToken, isAdmin, deleteEnquiry);
router.get("/", getAllEnquiry);
router.get("/:id", getaEnquiry);

export default router;