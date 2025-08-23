import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
);

// Common logs (info, warn, error, etc.)
const commonLogTransport = new DailyRotateFile({
    filename: path.join("logs", "common-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,   // compress old logs
    maxSize: "20m",        // rotate if >20MB
    maxFiles: "14d",       // keep 14 days
    level: "info"
});

// Error logs (errors only)
const errorLogTransport = new DailyRotateFile({
    filename: path.join("logs", "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",       // keep 30 days
    level: "error"
});

const logger = createLogger({
    level: "info",
    format: logFormat,
    transports: [
        new transports.Console(),
        commonLogTransport,
        errorLogTransport
    ]
});

export default logger;