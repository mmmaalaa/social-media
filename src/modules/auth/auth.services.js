import OTP from "../../DB/models/otp.js";
import userModel from "../../DB/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import OTPEvent from "../../utils/emailEvent.js";
import { compareHash } from "../../utils/hashing.js";
import { generateTokens, verifyToken } from "../../utils/token.js";
export const register = async (req, res, next) => {
  const { email } = req.body;
  let user = await userModel.findOne({ email });
  if (user && user.isVerified) {
    throw new AppError("User already exists and verified", 409);
  }
  const userDoc = await userModel.create(req.body);
  OTPEvent.emit("sendOtp", email);
  return res.status(201).json({
    success: true,
    message:
      "User created successfully, check your email to activate your account",
    data: userDoc,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new AppError("invalid email or password", 400);
  }
  const isMatch = compareHash({ plaintext: password, hash: user.password });
  if (!isMatch) {
    throw new AppError("invalid email or password", 400);
  }
  if (!user.isVerified) {
    throw new AppError("please activate your account first", 409);
  }
  if (user.isDelete) {
    throw new AppError("Your account has been deactivated", 410);
  }
  // const token = generateToken({payload:{id: user._id, email}});
  const { accessToken, refreshToken } = generateTokens(user);
  return res.status(201).json({
    success: true,
    message: "successfully logged in",
    accessToken,
    refreshToken,
  });
};

export const activateAccount = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, secretKey: process.env.JWT_SECRET });
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new AppError("user not found, please register first", 409);
  }
  user.isActive = true;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Your account is activated, now you can login",
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError("refresh token required", 401);
  }
  const decode = verifyToken({ token: refreshToken, secretKey: process.env.JWT_REFRESH_SECRET });
  const user = await userModel.findById(decode.id);

  if (!user && user.tokenVersion !== decode.tokenVersion) {
    throw new AppError("Invalid refresh token", 403);
  }
  const { accessToken } = generateTokens(user);
  return res.status(200).json({
    success: true,
    message: "successfully refreshed",
    token: accessToken,
  });
};

export const logOut = async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, {
    $inc: { tokenVersion: 1 },
  });

  return res
    .status(200)
    .json({ success: true, message: "logged out successfully" });
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp, purpose = "verification" } = req.body;
  const otpDoc = await OTP.findOne({
    email,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
  if (!otpDoc) throw new AppError("invalid OTP, please request a new one");
  if (otpDoc.attempts >= 3) {
    await OTP.deleteOne({ id: otpDoc._id });
    throw new AppError("Too many attempts. Please request a new OTP.", 400);
  }
  if (otpDoc.otp !== otp) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    return res.status(400).json({
      message: "Invalid OTP",
      attemptsLeft: 3 - otpDoc.attempts,
    });
  }
  otpDoc.isUsed = true;
  await otpDoc.save();
  if (purpose === "verification") {
    await userModel.findOneAndUpdate({ email }, { isVerified: true });
    res.json({
      success: true,
      message: "Account verified successfully",
    });
  } else if (purpose === "password_reset") {
    res.json({
      success: true,
      message: "OTP verified. You can now reset your password.",
      resetToken: otpDoc._id, // You can use this for password reset
    });
  }
};

export const resendOTP = async (req, res, next) => {
  const { email, purpose = "verification" } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) throw new AppError("user not found", 404);
  if (purpose === "verification" && user.isVerified) {
    throw new AppError("user already verified", 400);
  }
  OTPEvent.emit("sendOtp", email);
  res.json({
    success: true,
    message: "OTP resent successfully",
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) throw new AppError("user not found", 404);
  OTPEvent.emit("sendOtp", email, "password_reset");
  return res.status(200).json({
    success: true,
    message: "OTP send successfully, check your email ",
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, newPassword, resetToken } = req.body;
  const otpDoc = await OTP.findOne({
    email,
    _id: resetToken,
    isUsed: true,
    purpose: "password_reset",
  });
  if (!otpDoc) throw new AppError("OTP not found", 404);
  const user = await userModel.findOneAndUpdate(
    { email },
    { $set: { password: newPassword } }
  );
  // Delete the used OTP
  await OTP.deleteOne({ _id: resetToken });

  res.json({
    success: true,
    message: "Password reset successful",
  });
};
