import express from "express";
import bootstrap from "./src/app.controller.js";
const app = express();
const PORT = process.env.PORT || 3000;
await bootstrap(app, express);
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
