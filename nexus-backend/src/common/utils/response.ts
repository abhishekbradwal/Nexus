import { Response } from "express";
import { STATUS_CODES } from "../../config/constants";

export const successResponse = (
  res: Response,
  data: any = null,
  message: string = "Success",
  statusCode: number = STATUS_CODES.OK
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string = "Error occurred",
  statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
  errors: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export const serviceResponse = <T>(
  data: T,
  message: string = "Operation successful"
): ServiceResult<T> => {
  return {
    success: true,
    data,
    message,
  };
};


