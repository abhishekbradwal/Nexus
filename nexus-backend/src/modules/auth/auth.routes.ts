import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import * as googleAuthController from "./controllers/googleAuth.controller";

const router = Router();

router.get("/google", asyncHandler(googleAuthController.googleAuthUrl));
router.get("/google/callback", asyncHandler(googleAuthController.googleCallback));

export default router;
