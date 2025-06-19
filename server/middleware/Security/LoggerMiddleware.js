const winston = require("winston");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Ensure the 'logs' directory exists
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Winston Logger Configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
    // new winston.transports.Console({
    //   format: winston.format.prettyPrint(), // Better console readability
    // }),
  ],
});

// Morgan Middleware (Logging HTTP Requests with IP)
const httpLogger = morgan(
  (tokens, req, res) => {
    try {
      const clientIp =
        (req.headers["x-forwarded-for"]?.split(",")[0] || "").trim() ||
        req.socket.remoteAddress;

      const logData = {
        timestamp: new Date().toISOString(),
        ip: clientIp,
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        response_time: tokens["response-time"](req, res) + " ms",
        user_agent: tokens["user-agent"](req, res),
      };

      return JSON.stringify(logData, null, 2); // Pretty JSON format
    } catch (error) {
      logger.error("Error in request logging: " + error.message);
      return "";
    }
  },
  {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }
);

module.exports = { logger, httpLogger };
