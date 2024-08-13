import { ApiResponse } from '../utils/ApiResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Seller from '../models/User/Seller.js';
import { validationResult } from 'express-validator';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

 const registerSeller = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation errors', errors.array()));
    }

    const { name, email, password, business_name, role_id } = req.body;

    let profilePicUrl = null;
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (uploadResult) profilePicUrl = uploadResult.secure_url;
    }
    console.log("profileLogoPicUrl", profilePicUrl);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = await Seller.create({
            name,
            email,
            password: hashedPassword,
            business_name,
            role_id
        });

        res.status(201).json(new ApiResponse(201, newSeller, 'Seller registered successfully'));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));n
    }
};

 const loginSeller = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation errors', errors.array()));
    }

    const { email, password } = req.body;

    try {
        const seller = await Seller.findOne({ where: { email }, include: ['role'] });

        if (!seller) {
            return next(new ApiError(401, 'Invalid email or password'));
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            return next(new ApiError(401, 'Invalid email or password'));
        }

        const token = jwt.sign(
            { id: seller.id, role: seller.role.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json(new ApiResponse(200, { token, seller: { id: seller.id, email: seller.email, role: seller.role.name } }));
    } catch (error) {
        next(new ApiError(500, 'Server error', [], error.stack));
    }
};

 const logoutSeller = (req, res) => {
    res.json(new ApiResponse(200, null, 'Logout successful'));
};

export{
    registerSeller,
    loginSeller,
    logoutSeller
}