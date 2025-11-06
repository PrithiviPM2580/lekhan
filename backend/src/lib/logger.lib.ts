import winston from "winston";
import path, { format } from "path";
import chalk from "chalk";
import util from "util";
import config from "config/envValidation.config.js";

interface LogFormat extends winston.Logform.TransformableInfo {
  message: string;
  label?: string;
}

const { combine, timestamp, printf } = winston.format;

const logDir = path.join(process.cwd(), "logs");

const transports: winston.transport[] = [];

const customFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf((info) => {
    const { timestamp, level, message, label, ...meta } = info as LogFormat;
    const labelText = label ? label : "APP";

    const cleanMeta = Object.fromEntries(
      Object.entries(meta).filter(([key]) => typeof key === "string")
    );
    const metaStr = Object.keys(cleanMeta).length
      ? `\n${JSON.stringify(cleanMeta, null, 2)}`
      : "";

    switch (level) {
      case "info":
        return `🟢 ${chalk.gray(timestamp)} [${chalk.green(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.green(
          labelText
        )}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
      case "error":
        return `🔴 ${chalk.gray(timestamp)} [${chalk.red(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.red(
          labelText
        )}]: ${chalk.greenBright(message)} ${chalk.redBright(metaStr)}`;
      case "warn":
        return `🟡 ${chalk.gray(timestamp)} [${chalk.yellow(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.yellow(
          labelText
        )}]: ${chalk.greenBright(message)} ${chalk.yellowBright(metaStr)}`;
      default:
        return `${chalk.gray(timestamp)} [${chalk.green(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.green(
          labelText
        )}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
    }
  })
);

if (config.NODE_ENV !== "production" && config.NODE_ENV !== "test") {
  transports.push(
    new winston.transports.Console({
      level: config.LOG_LEVEL,
      format: customFormat,
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
    })
  );

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "errors.log"),
      level: "error",
    })
  );

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    })
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: customFormat,
  transports,
  silent: config.NODE_ENV === "test",
});

export default logger;
