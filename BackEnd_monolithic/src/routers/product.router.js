import express from 'express';
import { createProduct, updateProduct, getAllProducts, getProductById, deleteProduct } from '../controllers/product.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/createProduct', upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), createProduct);

router.put('/products/:id', updateProduct);
router.get('/getAllProduct', getAllProducts);
router.get('/products/:id', getProductById);
router.delete('/products/:id', deleteProduct);

export default router;
