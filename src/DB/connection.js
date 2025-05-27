import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1); // Exit the process with failure
    });
};

export default connectDB;
