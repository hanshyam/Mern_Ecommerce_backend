import asyncHandler from 'express-async-handler';
import userModel from '../models/userModel.js';
import crypto from 'crypto';
import validateMongoDbId from '../utils/validateMongoId.js';
import GenerateJwtToken from '../config/generateJwtToken.js';
import GenerateRefreshToken from '../config/generateRefreshToken.js';
import jwt from 'jsonwebtoken'
import sendEmail from './emailController.js';
import cartModel from '../models/cartModel.js';
import productModel from '../models/productModel.js';
import couponModel from '../models/couponModel.js';
import orderModel from '../models/orderModel.js';
import uniqid from 'uniqid';

const userRegister = asyncHandler( async(req,res)=>{
    const {First_Name,Last_Name,email,password,phone} = req.body;

    if(!First_Name||!Last_Name||!email||!password||!phone){
        res.status(404);
        throw new Error("All fields are mandatory!");
    }

    const findUser = await userModel.findOne({email});
    if(findUser){
        res.status(404);
        throw new Error("User does Exist!");
    }
    
    // const hashedPassword = await bcrypt.hash(password,10);
    const newUser = await userModel.create({
        First_Name,
        Last_Name,
        email,
        phone,
        password,
    })

    res.status(201).json(newUser);
})


const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await userModel.findOne({ email });

    if (user && (await user.isPasswordMatched(password))) {
        const refreshToken = GenerateRefreshToken(user._id);
        await userModel.findByIdAndUpdate(
            user._id,
            { refreshToken: refreshToken },
            { new: true }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            firstname: user.First_Name,
            lastname: user.Last_Name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: GenerateJwtToken(user), // Pass the full user object here
        });
        
    } else {
        res.status(401);
        throw new Error("Email or password is not valid!");
    }
});

// admin login functionality
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const admin = await userModel.findOne({ email });
    if(admin.role!=='admin'){
        throw new Error("User is not authorized as admin");
    }

    if (admin && (await admin.isPasswordMatched(password))) {
        const refreshToken = GenerateRefreshToken(admin._id);
        await userModel.findByIdAndUpdate(
            admin._id,
            { refreshToken: refreshToken },
            { new: true }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            firstname: admin.First_Name,
            lastname: admin.Last_Name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            token: GenerateJwtToken(admin), // Pass the full user object here
        });
        
    } else {
        res.status(401);
        throw new Error("Email or password is not valid!");
    }
});


// handle refresh token
const handleRefreshToken = asyncHandler( async (req,res)=>{
    const cookie = req.cookies;
    if(!cookie.refreshToken){
        throw new Error("No refresh token is available");
    }
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({ refreshToken });
    if(!user){
        throw new Error("No refresh token available in db or not matched")
    }
    jwt.verify(refreshToken,process.env.MY_TOKEN_STRING,(err,decoded)=>{
        if(err || user.id!==decoded.id){
            res.status(401);
            throw new Error("There is something wrong with refresh token");
        }else{
            const accessToken = GenerateJwtToken(user.id);
            res.json({accessToken});
        }
    })
})

// logout functionality
const logout = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie.refreshToken){
        throw new Error("No refresh token is available");
    }
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({ refreshToken } );
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204); //forbidden
    }
    await userModel.findOneAndUpdate({refreshToken},{
         refreshToken:"",
    });
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    });
     res.sendStatus(204); //forbidden
})

// Get all users
const getAllUsers = asyncHandler( async (req,res)=>{
    const user = await userModel.find();
    res.json(user);
})

// get single user by id
const getUser = asyncHandler( async (req,res)=>{
    const user = await userModel.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User does not exist!");
    }
    res.json(user);
})

// update user info
const updateUser = asyncHandler( async (req,res)=>{
    
    validateMongoDbId(req.params.id);
    const updatedUser = await userModel.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new : true}
    )
    res.json(updatedUser);

})

// delete single user by id
const deleteUser = asyncHandler( async (req,res)=>{
    validateMongoDbId(req.params.id);
    const user = await userModel.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User does not exist!");
    }
    
    await userModel.findByIdAndDelete(req.params.id);

    res.json({message:"User successfully deleted",success:true})
})

// block the use
const blockUser = asyncHandler( async(req,res)=>{
    const user_id = req.params.id;
    validateMongoDbId(user_id);
    const BlockedUser = await userModel.findByIdAndUpdate(user_id,{
        isBlock:true,
    },
     {
        new:true,
     })
    res.json(BlockedUser);
})
// Unblock the user
const unblockUser = asyncHandler( async(req,res)=>{
    const user_id = req.params.id;
    validateMongoDbId(user_id);
    const unBlockedUser = await userModel.findByIdAndUpdate(user_id,{
        isBlock:false,
    },{
        new:true,
     })
    res.json(unBlockedUser);
})


// update password
const updatePassword = asyncHandler( async (req,res)=>{
    const id = req?.user?.id;
    const password =  req.body.password;
    validateMongoDbId(id);
    const user = await userModel.findById(id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json({updatedPassword});
    }else{
        res.json({user});
    }
})

// forgot password token generator
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email }); // This gets the user document instance
 
    if (!user) {
        throw new Error("User not found with this email");
    }
 
    // Call the method on the user instance
    const token = user.createPasswordResetToken();
 
    // Save the user with the reset token and expiration time
    await user.save();  // Remember to save the changes
 
    const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 30 minutes from now. <a href='http://localhost:4000/api/user/reset-password/${token}'>Click Here</a>`;
 
    const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        html: resetURL,
    };
 
    // Send the email with the reset link
    sendEmail(data);
 
    res.json({ message: "Password reset link sent", token });
 });
 
const resetPassword = asyncHandler( async (req,res)=>{
     const  password  = req.body.password;
     const token = req.params.token;
     const hashedToken = await crypto.createHash("sha256").update(token).digest("hex");
     
     const user = await userModel.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt: Date.now()}
     });
     if(!user){
        throw new Error("Token is not available or token expired");
     }
     user.password = password;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;

     await user.save();
     res.json(user);
})

// Add to wishlist
const addToWishList = asyncHandler(async (req, res) => {
    const prodId = req.body.id;
    validateMongoDbId(prodId);  

    try {
        // Check if req.user and req.user._id exist
        if (!req?.user || !req?.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Find the user in the database (populate the wishlist)
        const user = await userModel.findById(req.user.id);

        // Check if the user's wishlist exists
        if (!user?.wishlist) {
            user.wishlist = [];
        }

        // Check if the product is already in the wishlist
        const alreadyExist = user.wishlist.find(
            productId => productId.toString() === prodId
        );

        if (alreadyExist) {
            // Remove the product from the wishlist
            user.wishlist.pull(prodId);
        } else {
            // Add the product to the wishlist
            user.wishlist.push(prodId);
        }

        // Save the updated user object
        await user.save();
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// save address
const saveAddress = asyncHandler( async (req,res)=>{
    const id = req?.user?.id;
    console.log("   "+id+"   ");
    validateMongoDbId(id);
    const user = await userModel.findById(id);
    user.address = req.body.address;
    user.save();
    res.json(user);
})

// cart functionality
const userCart = asyncHandler( async (req,res)=>{
   const id = req?.user?.id;
   validateMongoDbId(id);
   const { cart } = req.body;
   try {
      let products = [];
      const user = await userModel.findById(id);
      
      const alreadyExistCart = await cartModel.findOne({orderby : user._id});
      if (alreadyExistCart) {
        await alreadyExistCart.deleteOne(); 
    }

      for(let i = 0;i<cart.length;i++){
        let object = {};
        object.product = cart[i].id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let getPrice = await productModel.findById(cart[i].id).select("price").exec();
        object.price = getPrice.price;
        products.push(object);
      }
      let cartTotal = 0;
      for(let i = 0;i<products.length;i++){
        cartTotal += products[i].count * products[i].price;
      }
      const newCart = await new cartModel({
        products,
        cartTotal,
        orderby:id,
      }).save();
      res.json(newCart);
   } catch (error) {
      throw new Error(error);
   }
});

const getUserCart = asyncHandler( async (req,res)=>{
   const id = req?.user?.id;
   validateMongoDbId(id);
   try {
      const cart = await cartModel.findOne({orderby:id}).populate('products.product');
      res.json(cart);
   } catch (error) {
       throw new Error(error);
   }
});

const emptyCart = asyncHandler(async (req, res) => {
    const id = req?.user?.id;
    validateMongoDbId(id);
    try {
        // Remove the user's cart by their ID
        const cart = await cartModel.findOneAndDelete({ orderby: id });
        
        // Return the deleted cart object or a message if it was successful
        res.json({
            message: cart ? 'Cart emptied successfully' : 'No cart found for this user',
            cart
        });
    } catch (error) {
        throw new Error(error);
    }
});


const applyCoupon = asyncHandler( async (req,res)=>{
    const {coupon} = req?.body;
    const {id} = req?.user;
    try {
        const validCoupon = await couponModel.findOne({name:coupon});
        if(!validCoupon){
            throw new Error("No such coupon exist");
        }
        const user = await userModel.findById(id);
        const {cartTotal} = await cartModel.findOne({orderby:id});
        

        let totalAfterDiscount = (cartTotal - (cartTotal*validCoupon.discount)/100).toFixed(2);
        await cartModel.findOneAndUpdate({orderby:user.id},{totalAfterDiscount},{new:true});
        res.json(totalAfterDiscount);
    } catch (error) {
        throw new Error(error);
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { id } = req?.user;
    validateMongoDbId(id);

    try {
        if (!COD) {
            throw new Error("Create cash order failed");
        }

        const user = await userModel.findById(id);

        // Correcting the cart query to use cartModel instead of userModel
        const userCart = await cartModel.findOne({ orderby: user.id });

        // Check if the cart exists
        if (!userCart) {
            throw new Error("No cart found for this user");
        }

        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        // Create the order
        const newOrder = await new orderModel({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: id,
            orderStatus: "Cash on Delivery",
        }).save();

        // Update product quantity and sold count
        const update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });

        const updated = await productModel.bulkWrite(update, {});
        res.json({ message: "Order created successfully" });
    } catch (error) {
        throw new Error(error);
    }
});

const getOrders = asyncHandler( async (req,res)=>{
    const {id} = req?.user;
    validateMongoDbId(id);
    try {
        const orders = await orderModel.findOne({orderby:id}).populate('products.product');
        res.json(orders);
    } catch (error) {
        throw new Error(error);
    }
})

const updateOrderStatus = asyncHandler( async (req,res)=>{
     const orderId = req.params.id;
     validateMongoDbId(orderId);
     const status = req.body.status;
     const order = await orderModel.findById(orderId);
     if(!order){
        throw new Error("the following order does not exist");
     }
     order.orderStatus = status;
     order.paymentIntent.status = status;

     order.save();
     res.json(order);
});

export {userRegister,
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
    updateOrderStatus,
};
