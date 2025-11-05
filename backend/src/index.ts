import app from "app.js";
import {
  connectToDatabase,
  gracefullyShutdownDatabase,
} from "config/database.config.js";
import config from "config/envValidation.config.js";
import logger from "lib/logger.lib.js";

const PORT = config.PORT || 3000;

(async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
    process.on("SIGINT", () => gracefullyShutdownDatabase(app));
    process.on("SIGTERM", () => gracefullyShutdownDatabase(app));
  } catch (error) {
    logger.error("❌Error starting the server", { error });
    process.exit(1);
  }
})();
