// import express from "express"
// import { Request, Response } from "express"
// import { createServer } from "http"

// const app = express()

// app.all("/*", (request: Request, response: Response) => {
//   let stringBody = ""

//   request.on("readable", () => {
//     stringBody += request.read() || ""
//   })

//   request.on("end", () => {
//     try {
//       stringBody = JSON.stringify(JSON.parse(stringBody), undefined, 2)
//     } catch (error) {
//       // pass
//     }

//     logger.info(`method: '${request.method}', route: '${request.url}'`)
//     if (stringBody) {
//       logger.info("body: ", stringBody)
//     }

//     response.sendStatus(200)
//   })
// })

// const server = createServer(app)

// server.listen(8080)
