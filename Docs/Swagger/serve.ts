const express = require("express");
const serverless = require("serverless-http");
const swaggerUI = require("swagger-ui-express");
import { swaggerDocs } from "./builder";

const app = express();
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`App is now on http://localhost:${port}`);
});
