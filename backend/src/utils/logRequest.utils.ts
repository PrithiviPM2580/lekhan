import logger from "lib/logger.lib.js";

const logRequest = ({ req, res, message, data, error }: LogOptions) => {
  const start = req.startTime || Date.now();
  const responseTime = `${Date.now() - start}ms`;

  const meta: Record<string, unknown> = {
    method: req.method,
    url: req.originalUrl,
    baseYrl: req.baseUrl || "",
    ip: req.ip || req.socket.remoteAddress,
    statusCode: res?.statusCode || null,
    responseTime,
  };

  if (data) meta.data = data;
  if (error) meta.error = error;

  error ? logger.error(message, meta) : logger.info(message, meta);
};
