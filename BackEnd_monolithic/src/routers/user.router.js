import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.controllers.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

// Route to handle user registration
router.post('/register', upload.single('profile_pic'), registerUser);
router.post('/loginUser', loginUser);
router.post('/logoutUser', logoutUser);


export default router;
