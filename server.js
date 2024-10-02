import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import blogRouter from './routes/blogRoute.js' 
import productCategoryRouter from './routes/productCategoryRoute.js'
import brandRouter from './routes/brandRoute.js'
import colorRouter from './routes/colorRoute.js'
import enqRouter from './routes/enqRoute.js'
import blogCategoryRouter from './routes/blogCategoryRoute.js'
import couponRouter from './routes/couponRoute.js'
import errorHandler from './middleware/errorHandler.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// import corps from 'corps';


const app = express();
connectDB();
const port = process.env.PORT||4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(errorHandler);
app.use(cookieParser());

app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/blog',blogRouter);
app.use('/api/pcategory',productCategoryRouter);
app.use('/api/bcategory',blogCategoryRouter);
app.use('/api/brand',brandRouter);
app.use('/api/color',colorRouter);
app.use('/api/enquiry',enqRouter);
app.use('/api/coupon',couponRouter);

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})