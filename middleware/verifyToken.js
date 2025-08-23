import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: "Unathorized- no token provided" })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.status(401).json({ success: false, message: "Unathorized- invalid token" })

        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log("Error in verifyToken", error);
        return res.status(500).json({ success: false, message: "Server error!" })
    }
}