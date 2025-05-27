import userModel from "../../DB/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import emailEvent from "../../utils/emailEvent.js";
import { compareHash } from "../../utils/hashing.js";
import { generateTokens, verifyToken } from "../../utils/token.js";
export const register = async (req, res, next) => {
  const user = await userModel.create(req.body);
  emailEvent.emit("sendEmail", req.body.email, req.body.username);
  return res.status(201).json({
    success: true,
    message:
      "User created successfully, check your email to activate your account",
    data: user,
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
  if (!user.isActive) {
    throw new AppError("please activate your account first", 409);
  }
  if (user.isDelete) {
    throw new AppError("Your account has been deactivated", 410);
  }
  // const token = generateToken({payload:{id: user._id, email}});
  const { accessToken, refreshToken } = generateTokens(user);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.status(201).json({
    success: true,
    message: "successfully logged in",
    token: accessToken,
  });
};

export const activateAccount = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });
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
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new AppError("refresh token required", 401);
  }
  const decode = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await userModel.findById(decode._id);
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
  // Clear refresh token cookie
  res.clearCookie("refreshToken");
  return res
    .status(200)
    .json({ success: true, message: "logged out successfully" });
};
