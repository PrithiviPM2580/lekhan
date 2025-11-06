import compression from "compression";
import type { Request, Response } from "express";
import zlib from "zlib";

const shouldCompress = (req: Request, res: Response): boolean => {
  // If response already has a compression header, skip it
  if (res.getHeader("Content-Encoding")) return false;

  // Allow clients to disable compression manually
  if (req.headers["x-no-compression"]) return false;

  // Normalize Content-Type (string or array)
  const rawContentType = res.getHeader("Content-Type");
  const contentType =
    typeof rawContentType === "string"
      ? rawContentType.toLowerCase()
      : Array.isArray(rawContentType)
      ? rawContentType.join(";").toLowerCase()
      : "";

  if (contentType) {
    if (
      contentType.startsWith("image/") ||
      contentType.startsWith("video/") ||
      contentType.startsWith("audio/") ||
      contentType.startsWith("application/zip") ||
      contentType === "application/pdf"
    ) {
      return false;
    }
  }
  // Fallback to Express default filter (compress text/html, json, etc.)
  return compression.filter(req, res);
};

const compressionMiddleware = compression({
  level: 6,
  threshold: 1024, // Only compress responses larger than 1KB
  filter: shouldCompress,
  brotli: { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } },
});

export default compressionMiddleware;
