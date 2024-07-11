import express from 'express';
import { registerUser } from '../controllers/user.controllers.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

// Route to handle user registration
router.post('/register', upload.single('profile_pic'), registerUser);

export default router;
