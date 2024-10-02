import express from 'express';
import { createProduct,getProduct,getAllProducts, updateProduct, deleteProduct,addRatings, uploadImages, deleteImages } from '../controllers/productController.js'
import {isAdmin,validateToken} from '../middleware/validateTokenHandler.js';
import { productImgResize, uploadPhoto } from '../middleware/uploadImage.js';
const router = express.Router();

router.post('/',validateToken,isAdmin,createProduct);
router.put('/upload',validateToken,isAdmin,uploadPhoto.array("images",10),productImgResize,uploadImages);

router.put('/rating',validateToken,addRatings);
router.get('/',getAllProducts);
router.get('/:id',getProduct);
router.put('/:id',validateToken, isAdmin,updateProduct);
router.delete('/:id',validateToken, isAdmin,deleteProduct);
router.delete('/delete-img/:id',validateToken, isAdmin,deleteImages);

export default router;