import { User } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import bcrypt from 'bcrypt';

// User registration handler
export const registerUser = async (req, res) => {
    const { username, email, password, first_name, last_name, phone_number, address, date_of_birth, role_id } = req.body;

    try {
        // Encrypt password
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const saltRounds = 10;  // Define the number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Upload profile picture if provided
        let profilePicUrl = null;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) profilePicUrl = uploadResult.secure_url;
        }
        console.log("profilePicUrl", profilePicUrl);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            first_name,
            last_name,
            profile_pic: profilePicUrl,
            phone_number,
            address,
            date_of_birth,
            role_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error.message); // Log detailed error message
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
