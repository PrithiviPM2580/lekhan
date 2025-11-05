import validate from "lib/validate.lib.js";
import envValidationSchema from "validators/env.validator.js";
import "dotenv/config";

const envConfig = {
  PORT: process.env.PORT!,
  LOCAL_URL: process.env.LOCAL_URL!,
  NODE_ENV: process.env.NODE_ENV!,
  LOG_LEVEL: process.env.LOG_LEVEL!,
  DB_NAME: process.env.DB_NAME!,
  APP_NAME: process.env.APP_NAME!,
  DB_URI: process.env.DB_URI!,
};

const config = validate(envValidationSchema, envConfig);

export default config;
