import express from 'express';
import { createProduct, updateProduct, getAllProducts, getProductById, deleteProduct } from '../controllers/product.controller.js';
import { multerUploads } from '../utils/multer.js'; // Assuming you have a multer setup for file uploads
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/products', upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), createProduct);

router.put('/products/:id', multerUploads, updateProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.delete('/products/:id', deleteProduct);

export default router;
