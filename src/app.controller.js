import connectDB from "./DB/connection.js";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import cors from "cors";
const bootstrap = async (app, express) => {
  app.use(express.json());
  app.use(cors())
  await connectDB();
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use((req, res, next) => {
    return next(new Error("API not found"), { cause: 404 });
  });
  app.use(errorHandler)
};


export default bootstrap;
