import express from "express";
import bootstrap from "./src/app.controller.js";
const app = express();
const ported = process.env.PORT || 3000;
await bootstrap(app, express);
app.listen(port, () => {
  console.log(`app is running on port ${ported}`);
});
