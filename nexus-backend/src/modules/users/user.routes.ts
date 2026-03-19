import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import * as userController from "./controllers/userSignup.controller";
import * as loginController from "./controllers/userLogin.controller";
const router = Router();

router.post("/signup", asyncHandler(userController.signup));
router.post("/login", asyncHandler(loginController.login));

export default router;
