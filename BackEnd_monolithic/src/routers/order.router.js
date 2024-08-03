import express from 'express';
import { createOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create-order', createOrder);
// router.get('/orders', getAllOrders);
// router.get('/orders/:id', getOrderById);
// router.put('/orders/:id/status', updateOrderStatus);
// router.delete('/orders/:id', deleteOrder);

export default router;
