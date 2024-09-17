import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Retrieve the token either from cookies or the Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Access token is missing or invalid.");
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findByPk(decoded?._id)
        if (!user) {
            throw new ApiError(401, "User not found or invalid access token.");
        }

        // Attach the user and their role to the request object for future middleware/route handlers
        req.user = user;
        req.userRole = user.role; // Assuming user model has a 'role' field.

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized access due to invalid token.");
    }
});
