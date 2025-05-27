import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
const port =process.env.PORT || 3000;
await bootstrap(app, express);
app.listen(port, () => {});
