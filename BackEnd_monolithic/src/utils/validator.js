import { check, validationResult } from 'express-validator';

export const loginValidator = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];
export const sellerValidator = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('business_name').notEmpty().withMessage('Business name is required')
];

// export const validateProduct = [
//     body('name').trim().notEmpty().withMessage('Product name is required').escape(),
//     body('description').trim().escape(),
//     body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
//     body('category_id').isInt().withMessage('Invalid category ID'),
//     body('stock_quantity').isInt().withMessage('Stock quantity must be an integer'),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json(new ApiError(400, errors.array()));
//         }
//         next();
//     }
// ];