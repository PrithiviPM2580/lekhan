import validate from "lib/validate.lib.js";
import envValidationSchema from "validators/env.validator.js";
import "dotenv/config";

const envConfig = {
  PORT: process.env.PORT!,
};

const config = validate(envValidationSchema, envConfig);

export default config;
