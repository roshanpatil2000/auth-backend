import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';

import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import logger from './utils/logger.js';
import requestLogger from './middleware/logger.middleware.js';
import errorHandler from './middleware/error.middleware.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 2904;


// app.use(cors({ origin: "http://localhost:3000" }));  // Allow your frontend
app.use(cors());

app.use(express.json()); // allows us to parse incoming requests with JSON payloads:req.body
app.use(requestLogger); // Apply logger middleware globally
app.use(cookieParser()); //allows us to parse incoming cookies



// Base health check route
app.get("/", (req, res) => {
    res.json({ message: "CAFÈ API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);






// Catch 404 (Not Found)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// Centralized error handler
app.use(errorHandler);


app.listen(port, () => {
    connectDB();
    // console.log('Server is running on', `http://localhost:${port}`);
    logger.info(`✅ Server running at http://localhost:${port}`);

});