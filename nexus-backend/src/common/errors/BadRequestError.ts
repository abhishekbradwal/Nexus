import { AppError } from "./AppError";
import { STATUS_CODES } from "../../config/constants";

export class BadRequestError extends AppError {
  constructor(message = "Bad request", data?: any) {
    super(message, STATUS_CODES.BAD_REQUEST, data);
  }
}