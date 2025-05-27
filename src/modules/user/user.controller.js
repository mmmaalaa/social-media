import { Router } from "express";
import * as userServices from "./user.services.js";
import * as userValidation from "./user.validation.js";
import { authentication } from "../../middleware/authentication.js";
import asyncHandler from "../../utils/asyncHandler.js";
import requireRole from "../../middleware/authorization.js";
import validateRequest from "../../middleware/validation.js";

const router = Router();

router.get(
  "/profile",
  asyncHandler(authentication),
  asyncHandler(userServices.profile)
);
router.put(
  "/update-profile",
  asyncHandler(authentication),
  validateRequest(userValidation.userUpdateSchema),
  asyncHandler(userServices.updateProfile)
);
router.patch("/update-email", 
  asyncHandler(authentication),
  validateRequest(userValidation.updateEmailSchema),
  asyncHandler(userServices.updateEmail)
);
router.patch(
  "/update-password",
  asyncHandler(authentication),
  validateRequest(userValidation.updatePasswordSchema),
  asyncHandler(userServices.updatePassword)
);
router.get("/verify-old-email/:token",asyncHandler(userServices.verifyOldEmail));
router.get("/verify-new-email/:token",asyncHandler(userServices.verifyNewEmail));
router.delete(
  "/",
  asyncHandler(authentication),
  asyncHandler(userServices.deActivateAccount)
);
export default router;
