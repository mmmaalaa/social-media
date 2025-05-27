import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.DATABASE)
    .then(() => {
    })
    .catch((error) => {

    });
};

export default connectDB;
