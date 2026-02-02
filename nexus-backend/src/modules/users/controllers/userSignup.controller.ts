import { Request, Response } from "express";
import { UserService } from "../services/userSignUp.service";
import { successResponse } from "../../../common/utils/response";
import { STATUS_CODES } from "../../../config/constants";

const userService = new UserService();

export const signup = async (req: Request, res: Response) => {
  const { email, name, password, roleName } = req.body;

  const result = await userService.signup({ email, name, password, roleName });

  return successResponse(
    res,
    result.data,
    result.message,
    STATUS_CODES.CREATED
  );
};
