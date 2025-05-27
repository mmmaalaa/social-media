import joi from "joi";
import { customJoi, generalFields } from "../../middleware/validation.js";

export const sendMessage = joi.object({
  receiver: generalFields.checkId.required(),
  content: generalFields.content.required(),
});
export const Message = joi.object({
  id: generalFields.checkId.required(),
});
