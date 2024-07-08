import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Apply CORS middleware
app.use(cors({
    origin: '*',
    credentials: true // If you're using cookies or other credentials
}));



export default app;