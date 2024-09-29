import { swaggerDocs } from "./builder";

var fs = require("fs");
fs.writeFile(
  "swagger.json",
  JSON.stringify(swaggerDocs, null, 2),
  function (err: any) {
    if (err) {
      console.log(err);
    }
  }
);
