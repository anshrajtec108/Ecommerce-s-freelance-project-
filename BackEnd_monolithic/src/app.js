import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import userRouter from "./routers/user.router.js";
import sellerRouter from './routers/seller.router.js'
import helmet from 'helmet';
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/v1/users', userRouter)
app.use('/api/seller', sellerRouter)

app.use(errorHandler);



export default app;