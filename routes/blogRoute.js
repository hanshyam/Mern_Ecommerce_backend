import express from 'express';
import { createBlog, deleteBlog, deleteImages, dislikeBlog, getaBlog, getAllBlogs, likeBlog, updateBlog,uploadImages } from '../controllers/blogController.js';
import { validateToken,isAdmin } from '../middleware/validateTokenHandler.js';
import { blogImgResize,uploadPhoto } from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/',validateToken,isAdmin,createBlog);
router.put('/likes',validateToken,likeBlog);
router.put('/dislikes',validateToken,dislikeBlog);
router.put('/upload/',validateToken,isAdmin,uploadPhoto.array("images",1),blogImgResize,uploadImages);
router.put('/:id',validateToken,isAdmin,updateBlog);
router.get('/',getAllBlogs);
router.get('/:id',getaBlog);
router.delete('/:id',validateToken,isAdmin,deleteBlog);
router.delete('/delete-img/:id',validateToken,isAdmin,deleteImages);


export default router;