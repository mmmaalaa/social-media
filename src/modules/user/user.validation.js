import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const userUpdateSchema = joi.object({
  username: generalFields.username,
  gender: generalFields.gender,
  phone: generalFields.phone,
});

export const updateEmailSchema = joi.object({
  newEmail: generalFields.email.required(),
  password: generalFields.password.required(),
});

export const updatePasswordSchema = joi.object({
  currentPassword: generalFields.password.required(),
  newPassword: generalFields.password
    .invalid(joi.ref("currentPassword"))
    .messages({ 'any.invalid': 'New password must be different from the old password'})
    .required(),
  confirmNewPassword: joi.string().valid(joi.ref("newPassword")).messages({
    'any.only': 'Confirm new password must match the new password'
  }).required(),
});

