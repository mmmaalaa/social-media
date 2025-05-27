// import { AppError } from "./appError.js";

const asyncHandler = (fn) => {
  return (req, res, next) => {
    // Simply forward to the global error handler
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
