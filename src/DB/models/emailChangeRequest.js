import mongoose from "mongoose";

const emailChangeRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    currentEmail: { type: String, required: true },
    newEmail: { type: String, required: true },
    oldEmailToken: { type: String, required: true },
    newEmailToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    oldEmailVerified: { type: Boolean, default: false },
    newEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const EmailChangeRequest = mongoose.model(
  "EmailChangeRequest",
  emailChangeRequestSchema
);
export default EmailChangeRequest;