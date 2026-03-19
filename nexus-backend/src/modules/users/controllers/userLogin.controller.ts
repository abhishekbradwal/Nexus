import { Request, Response } from "express";
import { LoginService } from "../services/userLogin.service";
import { successResponse } from "../../../common/utils/response";
import { STATUS_CODES } from "../../../config/constants";

const loginService = new LoginService();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await loginService.login({ email, password });

  return successResponse(res, result.data, result.message, STATUS_CODES.OK);
};
