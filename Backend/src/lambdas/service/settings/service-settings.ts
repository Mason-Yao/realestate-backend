import { LambdaEvent, NotImplementedError, Response, UnexpectedError, NotFoundError, BadRequestError, ConflictError, SetCorsOriginHeader } from "../../common"
import { logger, jsonParser } from "../../../../../Shared/Utils"
import { Settings } from "../../../../../Shared/Interface/settings"
import { validateEventInput } from "../../common/util"
import { getSettingPathSchema, addSettingBodySchema } from "./settings-types"
import { CRM_TABLE_NAME } from "../../../constants"
import SettingsManager from "./settings"

//-------------------------------------------------------------------------------------
export async function handler(event: LambdaEvent) {
  try {
    logger.info("Event: ", event)
    SetCorsOriginHeader(event.headers.origin)

    // always say Yes to options request
    if (event.httpMethod === "OPTIONS") {
      return Response(200)
    }

    const TABLE_NAME = event.test?.TableName || CRM_TABLE_NAME
    const settingManager = new SettingsManager(TABLE_NAME)

    switch (event.httpMethod) {
      case "GET": {
        if (event.resource === "/settings/{name}") {
          // get a setting
          const input = event.pathParameters
          logger.info(`Get the setting for ${input.name}`)
          if (!validateEventInput(input, getSettingPathSchema)) {
            return Promise.resolve(new BadRequestError("Not a valid get settings request").response())
          }
          const output = await settingManager.getByName(input.name)
          if (output.error) {
            return Promise.resolve(new NotFoundError("Not found").response())
          }
          logger.info("[Service] Get: " + JSON.stringify(output))
          return Response(200, output)
        } else {
          // List all settings
          logger.info(`List all settings`)
          const output = await settingManager.list() // TODO: pagination
          logger.info("[Service] List: " + JSON.stringify(output))
          return Response(200, { settings: output })
        }
      }

      // Add a settings
      case "POST": {
        logger.info("Add a settings")
        const item: Omit<Settings, "id" | "PK"> = jsonParser(event.body)
        if (!validateEventInput(item, addSettingBodySchema)) {
          return Promise.resolve(new BadRequestError("Not a valid add settings request").response())
        }
        // check if the setting key already there
        const result = await settingManager.getByName(item.name)
        if (result.error) {
          // not there? we add one
          const output = await settingManager.add(item)
          logger.info("[Service] Add: " + JSON.stringify(output))
          return Response(200, output)
        }
        return Promise.resolve(new ConflictError("Already exist").response())
      }

      // Edit a settings
      case "PUT": {
        logger.info("Edit a settings")
        const item: Omit<Settings, "id" | "PK"> = jsonParser(event.body)
        if (!validateEventInput(item, addSettingBodySchema)) {
          return Promise.resolve(new BadRequestError("Not a valid edit settings request").response())
        }
        // check if the setting key already there
        const result = await settingManager.getByName(item.name)
        if (!result.error && result.id) {
          // okay, get the id, and update the value
          const output = await settingManager.update(result.id, item)
          logger.info("[Service] Put: " + JSON.stringify(output))
          return Response(200, output)
        }
        return Promise.resolve(new NotFoundError("Not found handler").response())
      }

      // Delete a settings
      case "DELETE": {
        logger.info("Delete the setting")
        const input = event.pathParameters
        if (!validateEventInput(input, getSettingPathSchema)) {
          return Promise.resolve(new BadRequestError("Not a valid delete settings request").response())
        }
        const result = await settingManager.getByName(input.name)
        if (!result.error && result.id) {
          // okay, get the id, and delete the record
          const output = await settingManager.delete(result.id)
          logger.info("[Service] Delete: " + JSON.stringify(output))
          return Response(200, output)
        }
        // For security reason, we also return all good
        return Response(200)
      }

      default:
        return Promise.resolve(new NotImplementedError("Not implemented handler").response())
    }
  } catch (err) {
    logger.error("Error: ", err)
    return Promise.resolve(new UnexpectedError("Something went wrong").response())
  }
}
