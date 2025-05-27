import express from "express";
import bootstrap from "./src/app.controller.js";
const app = express();
const port = process.env.PORT || 3000;
await bootstrap(app, express);
console.log("PORT is:", process.env.PORT);
console.log("BASE_URL is:", process.env.BASE_URL);
app.listen(port);
