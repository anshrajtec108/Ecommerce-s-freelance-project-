import { User } from "../models/model_index.js";
import { asyncHandler } from "../utils/asyncHandler.js"




export const isAuthenticated = asyncHandler( async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies['auth_token'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findByPk(decoded.id, {
            include: ['role']
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
});


export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role.name; 
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden: You do not have the necessary permissions' });
        }

        next();
    };
};

export default authorizeRoles;
