// src/nested/project/jest.config.js
const path = require("path")
// Define path of project level config - extension not required as file will be imported via `require(process.env.JEST_DYNAMODB_CONFIG)`
process.env.JEST_DYNAMODB_CONFIG = path.resolve(__dirname, "./jest-dynamodb-config")
module.exports = {
  setupFiles: ["<rootDir>/setEnvVars.ts"],
  collectCoverageFrom: ["src/common/**/*.ts*", "src/lambdas/**/*.ts*"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
  testRegex: "/(src|test)/mock-test/.*\\.(test).(ts|tsx)$",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  preset: "@shelf/jest-dynamodb",
}
