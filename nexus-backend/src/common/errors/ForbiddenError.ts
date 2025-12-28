import { AppError } from "./AppError";
import { STATUS_CODES } from "../../config/constants";

export class ForbiddenError extends AppError {
  constructor(message = "Access denied", data?: any) {
    super(message, STATUS_CODES.FORBIDDEN, data);
  }
}