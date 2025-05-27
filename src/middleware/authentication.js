import userModel from "../DB/models/user.model.js";
import { AppError } from "../utils/appError.js";
import { verifyToken } from "../utils/token.js";
export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization.startsWith("Bearer")) {
    throw new AppError("Invalid token", 401);
  }
  const token = authorization.split(" ")[1];
  const { id } = verifyToken({ token });

  const user = await userModel.findById(id).select("-password -__v").lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isDelete) {
    throw new AppError("User account has been disActivated", 410);
  }
  req.user = user;
  next();
};
