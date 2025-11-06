import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, email, role) => {
    const token = jwt.sign({ userId, email, role, }, process.env.JWT_SECRET, {
        expiresIn: "24h", // 7d, 30d, 
    });

    // res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // }); 

    return token;
}