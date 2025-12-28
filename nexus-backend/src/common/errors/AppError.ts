export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean = true;
  public readonly data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}
