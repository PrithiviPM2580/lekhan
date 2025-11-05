import { z } from "zod";

const envValidationSchema = z.object({
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  LOCAL_URL: z.string().url().default("http://localhost"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DB_NAME: z.string().min(2).max(100).default("lekhanDB"),
  APP_NAME: z.string().min(2).max(100).default("lekhan"),
  DB_URI: z
    .string()
    .min(10)
    .max(500)
    .default("mongodb://localhost:27017/lekhanDB"),
});

export default envValidationSchema;
