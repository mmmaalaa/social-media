import { model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["verification", "password_reset"],
      default: "verification",
    },
    attempts: {
      type: Number,
      max: 3,
      default: 0,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
  },
  { timestamps: true }
);

otpSchema.index({email:1, purpose:1});
const OTP = model("OTP", otpSchema);

export default OTP;
