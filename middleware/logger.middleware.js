import logger from "../utils/logger.js";
const SENSITIVE_FIELDS = ["password", "token", "authorization", "secret"];

const sanitizeBody = (body) => {
    if (!body || typeof body !== "object") return body;

    const sanitized = { ...body };
    for (const field of SENSITIVE_FIELDS) {
        if (sanitized[field]) {
            sanitized[field] = "*******";
        }
    }
    return sanitized;
};


const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const { method, originalUrl, ip, headers } = req;
        const { statusCode } = res;
        const userAgent = headers["user-agent"] || "unknown";

        // sanitize body
        const safeBody = sanitizeBody(req.body);

        const logMessage = `${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip} - UA: ${userAgent} - Body: ${JSON.stringify(
            safeBody
        )}`;

        if (statusCode >= 400) {
            logger.error(logMessage);
        } else {
            logger.info(logMessage);
        }
    });
    next();
};

export default requestLogger;