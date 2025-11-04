import { z } from "zod";
import { APIError } from "utils/index.utils.js";

const validateSchema = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw new APIError(500, "Validation Error", {
      type: "ValidationError",
      details: issues,
    });
  }

  return parsed.data;
};

export default validateSchema;
