import express from 'express';
import { addItemToCart, getCartItems, updateCartItemQuantity, removeCartItem } from '../controllers/cart.controller.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js'; // Assuming you have an authentication middleware
// import { validateRequest } from '../middlewares/validateRequest.js'; // For validating incoming requests

const router = express.Router();

// Add an item to the cart
router.post('/add', addItemToCart);

// Get all items in the cart
router.get('/:user_id', getCartItems);

// Update item quantity in the cart
router.put('/update',  updateCartItemQuantity);

// Remove item from the cart
router.delete('/remove/:cart_item_id', removeCartItem);

export default router;
