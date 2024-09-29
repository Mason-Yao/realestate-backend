#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { ServiceCRMStack } from "../src/ServiceCRMStack"
import { IConfig } from "../src/config"
import { logger } from "../../Shared/Utils"
const path = require("path")

const app = new cdk.App()
if (!process.env.CRM_ENV) {
  console.error("Error: CRM_ENV is not defined")
  process.exit(-1)
}

const env = process.env.CRM_ENV
logger.info("Env: ", env)

const file = path.resolve(__dirname, `../configs/${env}.json`)
logger.info("Loading config file: ", file)
const config: IConfig = require(file) // eslint-disable-line

const stackName = `RealEstate-CRM-${config.environment}`

new ServiceCRMStack(app, `${stackName}`, {
  env: {
    region: config.aws_region,
  },
  config,
  tags: {
    Env: env,
    StackName: stackName,
  },
})
