import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const adminToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: "Unathorized- no token provided" })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded)
            return res.status(401).json({ success: false, message: "Unathorized- invalid token" });

        const user = await User.findById(decoded.userId);
        if (!user)
            return res.status(403).json({ success: false, message: "Unathorized- User not found!" });

        if (user.role !== "admin")
            return res.status(403).json({ success: false, message: "Unathorized- User is not admin!" });


        console.log("decoded usr===>", decoded.userId)
        console.log("decoded usr===>", decoded.role)
        console.log("decoded email===>", decoded.email)
        req.userId = decoded.userId;
        req.role = decoded.role;
        req.email = decoded.email;
        next()
    } catch (error) {
        console.log("Error in verifyToken", error);
        return res.status(500).json({ success: false, message: "Server error!" })
    }
}