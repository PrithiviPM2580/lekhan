import { z } from "zod";
import { APIError } from "utils/index.utils.js";
import logger from "./logger.lib.js";

const validate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    logger.error("❌ Validation Error", {
      label: "ValidateLib",
      issues,
    });
    throw new APIError(500, "Validation Error", {
      type: "ValidationError",
      details: issues,
    });
  }

  return parsed.data;
};

export default validate;
