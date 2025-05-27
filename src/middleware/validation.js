import mongoose from "mongoose";
import joi from "joi";
import { genders } from "../DB/models/user.model.js";

const validateRequest = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Include all errors
      allowUnknown: false, // Don't allow unknown properties
    });

    if (error) {
      const validationErrors = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: validationErrors,
      });
    } 
    next();
  };
};
export const customJoi = joi.extend((joi) => {
  return {
    type: "objectId",
    base: joi.string(),
    messages: {
      "objectId.invalid": "{{#label}} must be a valid ObjectId",
    },
    validate(value, helpers) {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return { value, errors: helpers.error("objectId.invalid") };
      }
      return { value: mongoose.Types.ObjectId.createFromHexString(value) };
    },
  };
});

export const generalFields = {
  email: joi.string().email(),
  password: joi.string().min(6),
  confirmPassword: joi.string().valid(joi.ref("password")),
  username: joi.string().min(3).max(20),
  phone: joi.string(),
  gender: joi.string().valid(...Object.values(genders)),
  checkId: customJoi.objectId(),
  content: joi.string().min(1).max(500),
};
export default validateRequest;
