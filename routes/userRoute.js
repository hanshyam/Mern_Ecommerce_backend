import express from 'express'
import { userRegister,
        userLogin,
        getAllUsers,
        getUser,
        deleteUser,
        updateUser,
        blockUser,
        unblockUser,
        handleRefreshToken,
        logout,
        updatePassword,
        forgotPasswordToken,
        resetPassword,
        adminLogin,
        addToWishList,
        saveAddress,
        userCart,
        getUserCart,
        emptyCart,
        applyCoupon,
        createOrder,
        getOrders,
        updateOrderStatus

} from '../controllers/userController.js';



const router = express.Router();
import {validateToken,isAdmin} from '../middleware/validateTokenHandler.js';
router.post('/register',userRegister);
router.post('/login',userLogin);
router.post('/admin-login',adminLogin);
router.post('/cart',validateToken,userCart);
router.delete('/empty-cart',validateToken,emptyCart);
router.get('/user-cart',validateToken,getUserCart);
router.post('/forgot-password-token',forgotPasswordToken);
router.get('/get-users',getAllUsers);
router.get('/get-orders',validateToken,getOrders);
router.get('/coupon',validateToken,applyCoupon);
router.post('/create-order',validateToken,createOrder);
router.post('/reset-password/:token',resetPassword);
router.get('/refresh',handleRefreshToken);
router.get('/logout',logout);
router.put('/password',validateToken,updatePassword);
router.put('/add-to-wishlist',validateToken,addToWishList);
router.put('/address',validateToken,saveAddress);
router.put('/update-order/:id',validateToken,isAdmin,updateOrderStatus);
router.get('/:id',validateToken,isAdmin,getUser);
router.delete('/:id',deleteUser);
router.put('/:id',validateToken,updateUser);
router.put('/user-block/:id',validateToken,isAdmin,blockUser);
router.put('/user-unblock/:id',validateToken,isAdmin,unblockUser);


export default router;