import { ApiResponse } from '../utils/ApiResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Seller from '../models/User/Seller.js';
import { validationResult } from 'express-validator';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { Role } from '../models/model_index.js';
import { Log } from '../models/log.model.js'; // Log model for MongoDB

const registerSeller = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Log validation errors
        await Log.create({
            level: 'ERROR',
            source: 'SELLER',
            message: 'Validation errors during registration',
            ipAddress: req.ip,
            additionalData: errors.array(),
            action: 'registerSeller',
            status: 'FAILED'
        });
        return next(new ApiError(400, 'Validation errors', errors.array()));
    }

    const { name, email, password, business_name, role_id, address, phone_number } = req.body;

    let profilePicUrl = null;
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (uploadResult) profilePicUrl = uploadResult.secure_url;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = await Seller.create({
            name,
            email,
            password: hashedPassword,
            business_name,
            role_id,
            phone_number,
            address,
            profile_pic: profilePicUrl
        });

        // Log successful registration
        await Log.create({
            level: 'INFO',
            source: 'SELLER',
            message: 'Seller registered successfully',
            userId: newSeller.id,
            ipAddress: req.ip,
            additionalData: { email },
            action: 'registerSeller',
            status: 'SUCCESS'
        });

        res.status(201).json(new ApiResponse(201, newSeller, 'Seller registered successfully'));
    } catch (error) {
        // Log server error
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Server error: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'registerSeller',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
};

const loginSeller = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Log validation errors
        await Log.create({
            level: 'ERROR',
            source: 'SELLER',
            message: 'Validation errors during login',
            ipAddress: req.ip,
            additionalData: errors.array(),
            action: 'loginSeller',
            status: 'FAILED'
        });
        return next(new ApiError(400, 'Validation errors', errors.array()));
    }

    const { email, password } = req.body;

    try {
        const seller = await Seller.findOne({
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        if (!seller) {
            // Log invalid email or password
            await Log.create({
                level: 'ERROR',
                source: 'SELLER',
                message: 'Invalid email or password',
                ipAddress: req.ip,
                additionalData: { email },
                action: 'loginSeller',
                status: 'FAILED'
            });
            return next(new ApiError(401, 'Invalid email or password'));
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            // Log invalid password
            await Log.create({
                level: 'ERROR',
                source: 'SELLER',
                message: 'Invalid password',
                userId: seller.id,
                ipAddress: req.ip,
                additionalData: { email },
                action: 'loginSeller',
                status: 'FAILED'
            });
            return next(new ApiError(401, 'Invalid email or password'));
        }

        const token = jwt.sign(
            { id: seller.id, role: seller.role.name, seller },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        res.status(200)
            .cookie('accessToken', token, {
                httpOnly: true,
                secure: true, // Ensure this is true if you're using HTTPS
                sameSite: 'None', // Required for cross-origin requests
            })
            .json(new ApiResponse(200, { user: seller, token }, "Seller logged in successfully"));

        // Log successful login
        await Log.create({
            level: 'INFO',
            source: 'SELLER',
            message: 'Seller logged in successfully',
            userId: seller.id,
            ipAddress: req.ip,
            additionalData: { email },
            action: 'loginSeller',
            status: 'SUCCESS'
        });
    } catch (error) {
        // Log server error
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Server error: ${error.message}`,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'loginSeller',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
};

const logoutSeller = async (req, res) => {
    res.json(new ApiResponse(200, null, 'Logout successful'));

    // Log successful logout
    await Log.create({
        level: 'INFO',
        source: 'SELLER',
        message: 'Seller logged out successfully',
        userId: req.user ? req.user.id : null, // Assuming req.user is set after login
        ipAddress: req.ip,
        action: 'logoutSeller',
        status: 'SUCCESS'
    });
};

export {
    registerSeller,
    loginSeller,
    logoutSeller
};
