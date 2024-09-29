"use strict"
import { resolve } from "path"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import { Configuration, DefinePlugin } from "webpack"

const isDevelopment = process.env.NODE_ENV !== "production"

// always build lambda code so we get type checking in 'npm run watch' and can 'cdk deploy' at any time
const entry: { [key: string]: string } = {
  "lambdas/property": resolve(__dirname, "./src/lambdas/service/property/service-property.ts"),
  "lambdas/settings": resolve(__dirname, "./src/lambdas/service/settings/service-settings.ts"),
  "lambdas/agent": resolve(__dirname, "./src/lambdas/service/agent/service-agent.ts"),
  "lambdas/file": resolve(__dirname, "./src/lambdas/service/file/service-file.ts"),
}

if (isDevelopment) {
  entry["servers/webhook"] = resolve(__dirname, "./src/servers/webhook.ts")
}

const config: Configuration = {
  context: __dirname,
  devtool: isDevelopment ? "inline-source-map" : undefined,
  entry,
  externals: {
    "aws-sdk": "commonjs2 aws-sdk",
  },
  mode: isDevelopment ? "development" : "production",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          experimentalWatchApi: true,
          transpileOnly: true,
        },
        test: /\.ts$/,
      },
      {
        loader: "toml-loader",
        test: /\.toml$/,
      },
    ],
  },
  name: "CRM",
  node: {
    __dirname: false,
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: "[name]/index.js",
    libraryTarget: "umd",
    path: resolve(__dirname, "./.build"),
  },
  plugins: [
    new DefinePlugin({
      //"process.env.ENV": JSON.stringify(process.env.ENV ? process.env.ENV : "sandbox"),
      //"process.env.PROJECT_ID": JSON.stringify(process.env.PROJECT_ID ? process.env.PROJECT_ID : "000000"),
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".ts"],
  },
  target: "node",
}

export default config
