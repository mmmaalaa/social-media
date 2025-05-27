import { AppError } from "../utils/appError.js";

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You are not authorized to access this resource",
        403
      );
    }
    next();
  };
};

export default requireRole;
