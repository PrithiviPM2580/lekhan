import app from "app.js";
import {
  connectToDatabase,
  gracefullyShutdownDatabase,
} from "config/database.config.js";
import config from "config/envValidation.config.js";
import logger from "lib/logger.lib.js";

const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
    process.on("SIGINT", () => gracefullyShutdownDatabase(server));
    process.on("SIGTERM", () => gracefullyShutdownDatabase(server));
  } catch (error) {
    logger.error("❌ Error starting the server", { label: "Server", error });
    process.exit(1);
  }
};

export default startServer;
