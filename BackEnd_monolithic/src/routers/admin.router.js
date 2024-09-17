import express from 'express';
import {
    getUserById,
    getAllUsers,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getAllCategories,
    generateSalesReport,
    getUserActivityLog,
    handleSystemSettings,
    viewErrorLogs,
    reviewPendingOrders,
    searchLogs,
    getLogStatistics,
    totalUser,
    getErrorStatistics} from '../controllers/admin.controllwe.js'
const router = express.Router();

// User routes
router.get('/users/:id', getUserById);
router.get('/users', getAllUsers);

// Category routes
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/categories/:id', getCategoryById);
router.get('/categories', getAllCategories);

// Sales report route
router.get('/sales-report', generateSalesReport);

// User activity log route
router.get('/user-activity-log', getUserActivityLog);

// System settings route
router.put('/system-settings', handleSystemSettings);

// Error logs route
router.get('/error-logs', viewErrorLogs);

// Pending orders route
router.get('/pending-orders', reviewPendingOrders);

router.get('/search-logs', searchLogs);

router.get('/log-statistics', getLogStatistics);
router.get('/error-statistics', getErrorStatistics);

router.get('/totalUser', totalUser)
export default router;
