import express from 'express';
import { createCategory, updateCategory, deleteCategory, getAllCategory, getaCategory } from '../controllers/blogCategoryController.js';
import { validateToken,isAdmin } from '../middleware/validateTokenHandler.js';

const router = express.Router();

router.post('/',validateToken,isAdmin,createCategory);
router.put('/:id',validateToken,isAdmin,updateCategory);
router.delete('/:id',validateToken,isAdmin,deleteCategory);
router.get('/',getAllCategory);
router.get('/:id',getaCategory);


export default router;