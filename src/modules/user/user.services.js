import userModel from "../../DB/models/user.model.js";
import { decrypt } from "../../utils/encryption.js";
import { AppError } from "../../utils/appError.js";
import { compareHash } from "../../utils/hashing.js";
import EmailChangeRequest from "../../DB/models/emailChangeRequest.js";
import sendEmail, { subject } from "../../utils/sendOTPEmail.js";
import { changeEmail } from "../../utils/changeEmail.js";
import crypto from "crypto";
export const profile = async (req, res, next) => {
  const { user } = req;
  const phone = decrypt({ data: user.phone });
  return res.status(200).json({
    success: true,
    message: "User profile",
    data: { ...user, phone },
  });
};

export const updateProfile = async (req, res, next) => {
  const { user } = req;
  const updatedUser = await userModel
    .findByIdAndUpdate(
      user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .select("-password -__v -createdAt -updatedAt  -tokenVersion -_id");
  if (!updatedUser) {
    throw new AppError("user not found", 404);
  }
  return res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
};

export const updateEmail = async (req, res, next) => {
  const { newEmail, password } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const isMatch = compareHash({ plaintext: password, hash: user.password });
  if (!isMatch) {
    throw new AppError("Invalid password", 400);
  }
  // Check if the new email already exists
  const existingUser = await userModel.findOne({ email: newEmail });
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }
  // 4. Generate verification tokens for both emails
  const oldEmailToken = crypto.randomBytes(32).toString("hex");
  const newEmailToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const linkOldEmail = `${BASE_URL}/user/verify-old-email/${oldEmailToken}`;
  const linkNewEmail = `${BASE_URL}/user/verify-new-email/${newEmailToken}`;
  await EmailChangeRequest.create({
    userId: req.user._id,
    currentEmail: user.email,
    newEmail,
    oldEmailToken,
    newEmailToken,
    expiresAt,
  });
  sendEmail({
    to: user.email,
    subject: subject.emailChange,
    html: changeEmail(
      "You have requested to change the email associated with your account. To confirm your email change, please click the link below",
      linkOldEmail
    ),
  });
  sendEmail({
    to: newEmail,
    subject: subject.emailChange,
    html: changeEmail(
      "You have requested to change Your old email associated with your account. To confirm your email change, please click the link below",
      linkNewEmail
    ),
  });
  return res.status(200).json({
    success: true,
    message: "please check your old email and new email to confirm the change",
  });
};

export const verifyOldEmail = async (req, res, next) => {
  const { token } = req.params;
  const emailChangeRequest = await EmailChangeRequest.findOne({
    oldEmailToken: token,
    expiresAt: { $gt: new Date() },
  });
  if (!emailChangeRequest) {
    throw new AppError("Invalid or expired token", 400);
  }
  emailChangeRequest.oldEmailVerified = true;
  await emailChangeRequest.save();
  if (emailChangeRequest.newEmailVerified) {
    await userModel.findByIdAndUpdate(emailChangeRequest.userId, {
      email: emailChangeRequest.newEmail,
    });
    await EmailChangeRequest.findByIdAndDelete(emailChangeRequest._id);
  }
  return res.status(200).json({
    success: true,
    message: "Old email verified successfully",
  });
};

export const verifyNewEmail = async (req, res, next) => {
  const { token } = req.params;
  const emailChangeRequest = await EmailChangeRequest.findOne({
    newEmailToken: token,
    expiresAt: { $gt: new Date() },
  });
  if (!emailChangeRequest) {
    throw new AppError("Invalid or expired token", 400);
  }
  emailChangeRequest.newEmailVerified = true;
  await emailChangeRequest.save();
  if (emailChangeRequest.oldEmailVerified) {
    await userModel.findByIdAndUpdate(emailChangeRequest.userId, {
      email: emailChangeRequest.newEmail,
    });
    await EmailChangeRequest.findByIdAndDelete(emailChangeRequest._id);
  }
  return res.status(200).json({
    success: true,
    message: "New email verified. Please verify your current email address.",
  });
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const isMatch = compareHash({
    plaintext: currentPassword,
    hash: user.password,
  });
  if (!isMatch) {
    throw new AppError("Invalid current password", 400);
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

export const deActivateAccount = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  user.isDelete = true;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Account deactivated successfully",
  });
};
