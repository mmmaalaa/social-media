import { Router } from "express";
import * as authServices from "./auth.services.js";
import validateRequest from "../../middleware/validation.js";
import * as authValidation from "./auth.validation.js";
import asyncHandler from "../../utils/asyncHandler.js";
import authLimiter from "../../utils/ratelimit.js";
import { authentication } from "../../middleware/authentication.js";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.register),
  asyncHandler(authServices.register)
);
router.post(
  "/login",
  authLimiter,
  validateRequest(authValidation.login),
  asyncHandler(authServices.login)
);
router.get(
  "/activateAccount/:token",
  asyncHandler(authServices.activateAccount)
);

router.post("/refresh", asyncHandler(authServices.refreshToken));
router.post(
  "/logOut",
  asyncHandler(authentication),
  asyncHandler(authServices.logOut)
);

export default router;
