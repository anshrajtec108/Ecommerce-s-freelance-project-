import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import helmet from 'helmet';

//import router
import userRouter from "./routers/user.router.js";
import prodectRouter from "./routers/product.router.js";
import sellerRouter from './routers/seller.router.js'
import testingRouter from './routers/testing.router.js'
import paymentRouter from './routers/payment.router.js'
import orderRouter from './routers/order.router.js'

//import function  
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/v1/users', userRouter)
app.use('/api/v1/product', prodectRouter)
app.use('/api/v1/seller', sellerRouter)
app.use('/api/v1/testapi', testingRouter)
app.use('/api/v1/payment',paymentRouter)
app.use('/api/v1/order', orderRouter)

app.use(errorHandler);



export default app;