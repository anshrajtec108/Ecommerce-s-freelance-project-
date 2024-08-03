import { Role, User } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { loginValidator } from '../utils/validator.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, first_name, last_name, phone_number, address, date_of_birth, role_id } = req.body;
    console.log("username, email, password, first_name, last_name, phone_number, address, date_of_birth, role_id", username, email, password, first_name, last_name, phone_number, address, date_of_birth, role_id);
    if (!password) {
        return next(new ApiError(400, 'Password is required'));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let profilePicUrl = null;
    let profilePicpublic_id = null;

    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (uploadResult) profilePicUrl = await uploadResult.secure_url;
        if (uploadResult) profilePicpublic_id = await uploadResult.public_id

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
        return res.status(201).json(new ApiResponse(201, newUser, 'User registered successfully'));
    } catch (error) {
        next(new ApiError(500, `Server error${error}`, [], error.stack));
    }
});


const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log("email, password", email, password);

    const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }]
    });
   
    if (!user) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
        return next(new ApiError(401, 'Invalid   password'));
    }

    const token = jwt.sign(
        { id: user.id, role: user.role.name }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
 
    return res.json(new ApiResponse(200, { token, user: { id: user.id, email: user.email, role: user.role.name } }, 'Login successful'));
});



const logoutUser = (req, res) => {
    res.json(new ApiResponse(200, null, 'Logout successful'));
};

export {
    registerUser,
    loginUser,
    logoutUser,
};
