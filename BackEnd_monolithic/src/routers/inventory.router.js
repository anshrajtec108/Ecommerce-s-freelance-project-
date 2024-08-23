import express from 'express';
import { addInventory, getInventoryByProduct, updateInventory, deleteInventory } from '../controllers/inventory.controller.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js'; // Assuming you have an authentication middleware
// import { validateRequest } from '../middlewares/validateRequest.js'; // For validating incoming requests

const router = express.Router();

// Add inventory for a product
router.post('/add', addInventory);

// Get inventory details for a product
router.get('/:product_id',getInventoryByProduct);

// Update inventory quantity for a product
router.put('/update', updateInventory);

// Delete inventory record for a product
router.delete('/delete/:product_id',  deleteInventory);

export default router;
