import express from 'express';
import { registerSeller, loginSeller, logoutSeller } from '../controllers/seller.controller.js';
import authorizeRoles from '../middlewares/auth.middlewares.js';
import { sellerValidator, loginValidator } from '../utils/validator.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/register', sellerValidator, upload.single('profile_pic') ,registerSeller);
router.post('/login', loginValidator, loginSeller);
router.post('/logout', authorizeRoles(['seller']), logoutSeller);

export default router;
