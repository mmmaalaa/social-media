import joi from "joi";
import { genders } from "../../DB/models/user.model.js";
import { generalFields } from "../../middleware/validation.js";

export const register = joi.object({
  email: generalFields.email.required(),
  password: generalFields.password.required(),
  confirmPassword: generalFields.confirmPassword.required(),
  username: generalFields.username.required(),
  phone: generalFields.phone.required(),
  gender: generalFields.gender
});

export const login = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required()
});


