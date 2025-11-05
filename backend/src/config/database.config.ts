import mongoose, { ConnectOptions } from "mongoose";
import logger from "lib/logger.lib.js";
import config from "./envValidation.config.js";
import { APIError } from "utils/index.utils.js";

const errorMessage = {
  message: "Sample error message",
  code: 500,
};

const connectOptions: ConnectOptions = {
  dbName: config.DB_NAME,
  appName: config.APP_NAME,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 1,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

let isConnected = false;

export const connectToDatabase = async () => {
  if (!config.DB_URI) {
    logger.error("Database URI is not defined in the environment variables.", {
      label: "DatabaseConfig",
    });
    throw new APIError(500, "Database URI is not defined", {
      type: "DatabaseError",
      details: [
        {
          field: "DB_URI",
          message: "The database connection string is missing.",
        },
      ],
    });
  }
  if (isConnected) return;

  try {
    await mongoose.connect(config.DB_URI, connectOptions);
    isConnected = true;
    logger.info("✅ Connected to the database successfully", {
      label: "DatabaseConfig",
      errorMessage,
    });
  } catch (error) {
    logger.error("❌Error connecting to the database", {
      error,
      label: "DatabaseConfig",
    });
    throw new APIError(500, "Database connection failed", {
      type: "DatabaseError",
      details: [
        {
          message: (error as Error).message,
        },
      ],
    });
  }
};

export const disconnectFromDatabase = async () => {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("🛑 Disconnected from the database successfully");
  } catch (error) {
    logger.error("❌Error disconnecting from the database", {
      label: "DatabaseConfig",
      error,
    });
    throw new APIError(500, "Database disconnection failed", {
      type: "DatabaseError",
      details: [
        {
          message: (error as Error).message,
        },
      ],
    });
  }
};

export const gracefullyShutdownDatabase = async (server: any) => {
  logger.warn("⚠️ Server shutting down...");
  try {
    await disconnectFromDatabase();
  } catch (error) {
    logger.error("❌Error gracefully shutting down the database", { error });
    throw new APIError(500, "Database shutdown failed", {
      type: "DatabaseError",
      details: [
        {
          message: (error as Error).message,
        },
      ],
    });
  } finally {
    server.close(() => {
      logger.info("✅ HTTP server closed");
      process.exit(0);
    });
  }
};

mongoose.connection.on("connected", () => logger.info("📡 MongoDB connected"));
mongoose.connection.on("error", (err) => logger.error("⚠️ MongoDB error", err));
mongoose.connection.on("disconnected", () =>
  logger.warn("❌ MongoDB disconnected")
);
