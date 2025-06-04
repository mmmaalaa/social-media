import { Router } from "express";
import * as authServices from "./auth.services.js";
import validateRequest from "../../middleware/validation.js";
import * as authValidation from "./auth.validation.js";
import asyncHandler from "../../utils/asyncHandler.js";
import authLimiter from "../../utils/ratelimit.js";
import { authentication } from "../../middleware/authentication.js";

const router = Router();

router.post(
  "/verify-otp",
  validateRequest(authValidation.verifyOtp),
  asyncHandler(authServices.verifyOtp)
);
router.post(
  "/register",
  validateRequest(authValidation.register),
  asyncHandler(authServices.register)
);

router.post(
  "/resend-otp",
  validateRequest(authValidation.resendOtp),
  asyncHandler(authServices.resendOTP)
);
router.post(
  "/forget-pass",
  validateRequest(authValidation.forgetPassword),
  asyncHandler(authServices.forgetPassword)
);
router.post('/reset-pass', validateRequest(authValidation.resetPassword),asyncHandler(authServices.resetPassword))
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

router.post("/refresh-token", asyncHandler(authServices.refreshToken));
router.post(
  "/logOut",
  asyncHandler(authentication),
  asyncHandler(authServices.logOut)
);

export default router;
