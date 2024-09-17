import { Cart, CartItem, Product } from '../models/model_index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Add an item to the cart
export const addItemToCart = asyncHandler(async (req, res, next) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return next(new ApiError(400, 'Invalid data. User ID, Product ID, and Quantity are required.'));
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
        return next(new ApiError(404, 'Product not found.'));
    }

    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
        cart = await Cart.create({ user_id });
    }

    const cartItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id } });
    if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
    } else {
        await CartItem.create({ cart_id: cart.id, product_id, quantity });
    }

    res.status(201).json(new ApiResponse(201, cart, 'I tem added to cart successfully.'));
});

// Get all items in the cart
export const getCartItems = asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;

    const cart = await Cart.findOne({
        where: { user_id },
        include: { model: CartItem, include: Product }
    });

    if (!cart) {
        return next(new ApiError(404, 'Cart not found.'));
    }

    res.status(200).json(new ApiResponse(200, cart, 'Cart items retrieved successfully.'));
});

// Update item quantity in the cart
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { cart_item_id, quantity } = req.body;

    if (!cart_item_id || quantity === undefined) {
        return next(new ApiError(400, 'Cart item ID and quantity are required.'));
    }

    const cartItem = await CartItem.findByPk(cart_item_id);
    if (!cartItem) {
        return next(new ApiError(404, 'Cart item not found.'));
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(new ApiResponse(200, cartItem, 'Cart item updated successfully.'));
});

// Remove item from the cart
export const removeCartItem = asyncHandler(async (req, res, next) => {
    const { cart_item_id } = req.params;

    const cartItem = await CartItem.findByPk(cart_item_id);
    if (!cartItem) {
        return next(new ApiError(404, 'Cart item not found.'));
    }

    await cartItem.destroy();

    res.status(200).json(new ApiResponse(200, null, 'Cart item removed successfully.'));
});
