import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ValidationError } from "../errors/ValidationError";
import { logger } from "../utils/logger";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ");
      
      logger.warn({
        msg: "validation_error",
        requestId: req.headers["x-request-id"],
        path: req.originalUrl,
        errors: error.details,
      });
      
      throw new ValidationError(errorMessage);
    }
    
    next();
  };
};