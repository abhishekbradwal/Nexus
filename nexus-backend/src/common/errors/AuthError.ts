import {AppError} from "./AppError";
import {STATUS_CODES} from "../../config/constants";

export class AuthError extends AppError {
  constructor(message = "Authentication failed", data?: any ) {
    super(message, STATUS_CODES.UNAUTHORIZED, data);
  }
}
