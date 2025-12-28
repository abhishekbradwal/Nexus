import { AppError } from "./AppError";
import { STATUS_CODES } from "../../config/constants";

export class ValidationError extends AppError {
  constructor(message = "Validation failed", data?: any) {
    super(message, STATUS_CODES.BAD_REQUEST, data );
  }
}