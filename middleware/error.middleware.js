import logger from "../utils/logger.js";
import { errorResponse } from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message} - Stack: ${err.stack}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return errorResponse(res, message, statusCode);
};

export default errorHandler;