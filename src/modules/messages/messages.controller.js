import { Router } from "express";
import * as messageServices from "./message.services.js";
import * as messageValidations from "./message.validation.js";
import { authentication } from "../../middleware/authentication.js";
import asyncHandler from "../../utils/asyncHandler.js";
import validateRequest from "../../middleware/validation.js";
import requireRole from "../../middleware/authorization.js";
const router = Router();
router.post(
  "/",
  asyncHandler(authentication),
  validateRequest(messageValidations.sendMessage),
  asyncHandler(messageServices.sendMessage)
);
router.get(
  "/",
  asyncHandler(authentication),

  asyncHandler(messageServices.readAllMessages)
);
router.get(
  "/:id",
  asyncHandler(authentication),
  validateRequest(messageValidations.Message),
  asyncHandler(messageServices.readMessage)
);
router.delete(
  "/:id",
  asyncHandler(authentication),
  validateRequest(messageValidations.Message),
  asyncHandler(messageServices.deleteMessage)
);
export default router;
