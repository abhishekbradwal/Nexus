import { AppError } from "./AppError";
import { STATUS_CODES } from "../../config/constants";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found",data?: any) {
    super(message, STATUS_CODES.NOT_FOUND, data);
  }
}