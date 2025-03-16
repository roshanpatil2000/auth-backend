import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

dotenv.config();
const app = express();
const port = process.env.PORT || 2904;
// Swagger configuration options
// const swaggerOptions = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Authentication API Documentation',
//             version: '1.0.0',
//             description: 'API documentation for authentication endpoints',
//         },
//         servers: [
//             {
//                 url: `http://localhost:${port}`,
//                 description: 'Development server'
//             }
//         ]
//     },

//     // Path to the API docs
//     apis: ['./routes/*.js'] // Points to your route files
// };

// Initialize swagger-jsdoc
// const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json()); // allows us to parse incoming requests with JSON payloads:req.body
app.use(cookieParser()); //allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
// Swagger UI route
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route for API documentation
// app.get('/api-docs.json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
// });

app.listen(port, () => {
    connectDB();
    console.log('Server is running on',`http://localhost:${port}`);
    // console.log('API Documentation available at', `http://localhost:${port}/api-docs`);

});