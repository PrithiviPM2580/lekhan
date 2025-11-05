import winston from "winston";
import path from "path";
import chalk from "chalk";
import config from "config/envValidation.config.js";

const logDir = path.join(process.cwd(), "logs");

const customFormat = winston.format.printf(
  ({ timestamp, level, message, ...meta }) => {
    const metaData = Object.keys(meta).length
      ? `\n${chalk.greenBright(JSON.stringify(meta, null, 2))}`
      : "";
    return `${chalk.blue(timestamp)} [${chalk.yellow(
      level.toUpperCase()
    )}] ${chalk.magenta(`[APP]`)}: ${message} ${metaData}`;
  }
);

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

if (config.NODE_ENV !== "production" && config.NODE_ENV !== "test") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
    })
  );
}

export default logger;
