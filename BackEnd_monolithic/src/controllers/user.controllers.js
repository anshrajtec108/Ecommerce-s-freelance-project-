import { User } from '../models/model_index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import bcrypt from 'bcrypt';
import { loginValidator } from '../utils/validator.js';

// peanding to apply ApiResponse AND ApiError 

const registerUser =asyncHandler( async (req, res) => {
    const { username, email, password, first_name, last_name, phone_number, address, date_of_birth, role_id } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const saltRounds = 10;  // Define the number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let profilePicUrl = null;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) profilePicUrl = uploadResult.secure_url;
        }
        console.log("profilePicUrl", profilePicUrl);

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
});


const loginUser = asyncHandler(async (req, res) => {
    const errors = loginValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email }, include: ['role'] });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role.name },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_expiresIn }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role.name } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


const logoutUser = (req, res) => {
    // On the server side, we just send a success response.
    // Invalidate the JWT token on the client side.
    res.json(new ApiResponse(200, null, 'Logout successful'));
};


export {
    registerUser,
    loginUser,
    logoutUser,

}