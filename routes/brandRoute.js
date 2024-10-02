import express from 'express';
import { createBrand, updateBrand, deleteBrand, getAllBrand, getaBrand} from '../controllers/brandController.js';
import { isAdmin, validateToken } from '../middleware/validateTokenHandler.js';

const router = express.Router();

router.post('/',validateToken,isAdmin,createBrand);
router.put('/:id',validateToken,isAdmin,updateBrand);
router.delete('/:id',validateToken,isAdmin,deleteBrand);
router.get('/',getAllBrand);
router.get('/:id',getaBrand);

export default router;