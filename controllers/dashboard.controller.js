import dotenv from "dotenv"
import { User } from "../models/user.model.js";

dotenv.config()

export const getData = async (req, res) => {
    try {
        // Fetch only emails from User collection
        const users = await User.find({}, "email")
        const emails = users.map(user => user.email)
        // const 

        return res.json({
            success: true,
            message: "Token Generate successful",
            total: emails.length,
            data: { ...emails }
        })
    } catch (error) {
        console.error("Error fetching user emails:", error.message)
        return res.status(500).json({ error: "Failed to fetch user emails" })
    }
}

