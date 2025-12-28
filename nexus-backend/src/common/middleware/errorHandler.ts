import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { errorResponse } from "../utils/response";
import { STATUS_CODES } from "../../config/constants";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn({
      msg: "operational_error",
      requestId: req.headers["x-request-id"],
      message: err.message,
      statusCode: err.statusCode,
    });
    return errorResponse(res, err.message, err.statusCode, err.data);
  }

  logger.error({
    msg: "unexpected_error",
    requestId: req.headers["x-request-id"],
    message: err.message,
    stack: err.stack,
  });

  return errorResponse(res, "Internal server error", STATUS_CODES.INTERNAL_SERVER_ERROR);
};
