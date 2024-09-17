import { Role, User } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Log } from '../models/log.model.js'; // Log model for MongoDB

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, first_name, last_name, phone_number, address, date_of_birth, role_id } = req.body;

    // Check for missing password and log the error
    if (!password) {
        const errorMsg = 'Password is required';
        await Log.create({
            level: 'ERROR',
            source: 'USER',
            message: errorMsg,
            userId: null, // No user yet
            ipAddress: req.ip,
            additionalData: { username, email },
            action: 'registerUser',
            status: 'FAILED'
        });
        return next(new ApiError(400, errorMsg));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let profilePicUrl = null;
    let profilePicpublic_id = null;

    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (uploadResult) {
            profilePicUrl = uploadResult.secure_url;
            profilePicpublic_id = uploadResult.public_id;
        }
    }

    try {
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            first_name,
            last_name,
            profile_pic: profilePicUrl,
            profile_pic_public_id: profilePicpublic_id,
            phone_number,
            address,
            date_of_birth,
            role_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Log successful registration
        await Log.create({
            level: 'INFO',
            source: 'USER',
            message: 'User registered successfully',
            userId: newUser.id,
            ipAddress: req.ip,
            additionalData: { username, email },
            action: 'registerUser',
            status: 'SUCCESS'
        });

        return res.status(201).json(new ApiResponse(201, newUser, 'User registered successfully'));
    } catch (error) {
        // Log registration error
        await Log.create({
            level: 'ERROR',
            source: 'SYSTEM',
            message: `Server error: ${error.message}`,
            userId: null,
            ipAddress: req.ip,
            additionalData: { stack: error.stack },
            action: 'registerUser',
            status: 'FAILED'
        });
        next(new ApiError(500, `Server error: ${error.message}`, [], error.stack));
    }
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
        const errorMsg = 'Invalid email or password';

        // Log invalid login attempt
        await Log.create({
            level: 'ERROR',
            source: 'USER',
            message: errorMsg,
            userId: null,
            ipAddress: req.ip,
            additionalData: { email },
            action: 'loginUser',
            status: 'FAILED'
        });

        return next(new ApiError(401, errorMsg));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const errorMsg = 'Invalid password';

        // Log incorrect password attempt
        await Log.create({
            level: 'ERROR',
            source: 'USER',
            message: errorMsg,
            userId: user.id,
            ipAddress: req.ip,
            additionalData: { email },
            action: 'loginUser',
            status: 'FAILED'
        });

        return next(new ApiError(401, errorMsg));
    }

    const token = jwt.sign(
        { id: user.id, role: user.role.name, user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    res.status(200)
        .cookie('accessToken', token, {
            httpOnly: true,
            secure: true, // Ensure this is true if you're using HTTPS
            sameSite: 'None', // Required for cross-origin requests
        })
        .json(new ApiResponse(200, { user: user, token }, "User logged in successfully"));

    // Log successful login
    await Log.create({
        level: 'INFO',
        source: 'USER',
        message: 'User logged in successfully',
        userId: user.id,
        ipAddress: req.ip,
        additionalData: { email },
        action: 'loginUser',
        status: 'SUCCESS'
    });
});

const logoutUser = asyncHandler(async (req, res, next) => {
    res.json(new ApiResponse(200, null, 'Logout successful'));

    // Log successful logout
    await Log.create({
        level: 'INFO',
        source: 'USER',
        message: 'User logged out successfully',
        userId: req.user ? req.user.id : null, // Assuming req.user is set after login
        ipAddress: req.ip,
        action: 'logoutUser',
        status: 'SUCCESS'
    });
});

export {
    registerUser,
    loginUser,
    logoutUser,
};
