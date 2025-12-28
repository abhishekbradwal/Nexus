import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const requestId = req.headers["x-request-id"];

  res.on("finish", () => {
    const durationMs = Date.now() - start;

    logger.info({
      msg: "request_completed",
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
    });
  });

  next();
};
