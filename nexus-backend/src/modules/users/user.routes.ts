import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import * as userController from "./controllers/userSignup.controller";

const router = Router();

router.post("/signup", asyncHandler(userController.signup));

export default router;
