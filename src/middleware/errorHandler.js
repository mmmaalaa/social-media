import { AppError } from "../utils/appError.js";

// errorHandler.js - Global error handler
 const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  // console.error("ERROR 💥:", err);

  // Set default values
  let error = { ...err };
  
  error.message = err.message;
  error.name = err.name;

  // Handle MongoDB duplicate key errors (code 11000)
  if (err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : "field";
    const message = `Duplicate value for ${field}. This ${field} already exists.`;
    error = new AppError(message, 409);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    error = new AppError(message, 400);
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Your token has expired. Please log in again.", 401);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler