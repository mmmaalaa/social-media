import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import OTP from "../../DB/models/otp.js";

export const register = joi.object({
  email: generalFields.email.required(),
  password: generalFields.password.required(),
  confirmPassword: generalFields.confirmPassword.required(),
  username: generalFields.username.required(),
  phone: generalFields.phone.required(),
  gender: generalFields.gender,
});

export const login = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const verifyOtp = joi.object({
  email: generalFields.email.required(),
  otp: joi.string().required(),
  purpose: joi.string().valid("verification", "password_reset"),
});
export const resendOtp = joi.object({
  email: generalFields.email.required(),
  purpose: joi.string().valid("verification", "password_reset"),
});
export const forgetPassword = joi.object({
  email: generalFields.email.required(),
});
export const resetPassword = joi.object({
  email: generalFields.email.required(),
  newPassword: generalFields.password.required(),
  resetToken: generalFields.checkId.required()
});
