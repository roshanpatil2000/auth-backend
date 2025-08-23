import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 2904;


app.use(express.json()); // allows us to parse incoming requests with JSON payloads:req.body
app.use(cookieParser()); //allows us to parse incoming cookies

app.use("/api/auth", authRoutes);


app.listen(port, () => {
    connectDB();
    console.log('Server is running on', `http://localhost:${port}`);

});