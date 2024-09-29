import { BadRequestError, LambdaEvent, NotImplementedError, Response, UnexpectedError, SetCorsOriginHeader } from "../../common"
import { listPropertiesParameterSchema, getPropertyPathSchema, addPropertyBodySchema } from "./property-types"
import { logger, jsonParser, decode } from "../../../../../Shared/Utils"
import { Property, PropertyListParm } from "../../../../../Shared/Interface/property"
import { validateEventInput } from "../../common/util"
import { CRM_PROPERTY_TABLE_NAME, HEADER_PAGINATION_PER_PAGE } from "../../../constants"
import PropertyManager, { PropertyOutput } from "./property"

//-------------------------------------------------------------------------------------
export async function handler(event: LambdaEvent) {
  try {
    logger.info("Event: ", event)
    SetCorsOriginHeader(event.headers.origin)

    const TABLE_NAME = event.test?.TableName || CRM_PROPERTY_TABLE_NAME
    const property = new PropertyManager(TABLE_NAME)

    switch (event.httpMethod) {
      case "POST": {
        // Add a property
        logger.info("[Service] Add a property")
        const item: Omit<Property, "id" | "PK"> = jsonParser(event.body)
        if (!validateEventInput(item, addPropertyBodySchema)) {
          return Promise.resolve(new BadRequestError("Not a valid add property request").response())
        }
        const output = await property.addProperty(item)
        logger.info("[Service] Add: " + JSON.stringify(output))
        if (output.properties && output.properties.items.length > 0) {
          return Response(200, { properties: output.properties })
        }
        return Promise.resolve(new UnexpectedError(output.error?.message).response())
      }

      case "GET": {
        // list all property
        if (event.resource == "/property") {
          logger.info("[Service] List all property")
          const pageSize = Number(event.headers[HEADER_PAGINATION_PER_PAGE]) || undefined

          const param: PropertyListParm | undefined = event.queryStringParameters ? jsonParser(decode(event.queryStringParameters.param)) : undefined
          if (param && !validateEventInput(param, listPropertiesParameterSchema)) {
            return Promise.resolve(new BadRequestError("Not a valid list property request").response())
          }
          const output = await property.listProperties(param?.filter, pageSize, param?.lastEvaluatedKey)
          logger.info("[Service] List: " + JSON.stringify(output))
          
          if (output.properties) {
            return Response(200, { properties: output.properties })
          }
          return Promise.resolve(new UnexpectedError(output.error?.message).response())
        } else if (event.resource == "/property/{id}") {
          logger.info("[Service] Get a single property")
          const input = event.pathParameters
          if (!validateEventInput(input, getPropertyPathSchema)) {
            return Promise.resolve(new BadRequestError("Not a valid get property request").response())
          }
          if (input.id == "count") {
            // GET number of property
            logger.info("[Service] Get property count")
            const output = await property.getPropertyCount()
            logger.info("[Service] Get: " + JSON.stringify(output))
            if (Number.isInteger(output)) {
              return Response(200, { count: output })
            }
          } else {
            // GET property from a id
            const output = await property.getPropertyById(input.id)
            logger.info("[Service] Get: " + JSON.stringify(output))
            if (output.properties) {
              return Response(200, { properties: output.properties })
            }
            return Promise.resolve(new UnexpectedError(output.error?.message).response())
          }
          return Promise.resolve(new UnexpectedError().response())
        } else if (event.resource == "/property/search") {
          // TODO:
        }
        return Promise.resolve(new NotImplementedError("Not implemented handler").response())
      }

      case "PUT": {
        logger.info(`[Service] Edit property id: ${event.pathParameters.id}`)
        const inputPath = event.pathParameters
        if (!validateEventInput(inputPath, getPropertyPathSchema)) {
          return Promise.resolve(new BadRequestError("Not a valid update property request").response())
        }
        const item: Omit<Property, "PK" | "id"> = jsonParser(event.body)
        if (!validateEventInput(item, addPropertyBodySchema)) {
          return Promise.resolve(new BadRequestError("Not a valid update property request").response())
        }
        const output = await property.updateProperty(inputPath.id, item)
        logger.info("[Service] Put: " + JSON.stringify(output))
        return Response(200, { properties: output.properties })
      }

      case "DELETE": {
        logger.info(`[Service] Delete property id: ${event.pathParameters.id}`)
        const input = event.pathParameters
        if (!validateEventInput(input, getPropertyPathSchema)) {
          return Promise.resolve(new BadRequestError("Not a valid delete property request").response())
        }
        const output = await property.deleteProperty(input.id)
        logger.info("[Service] Delete: " + JSON.stringify(output))
        return Response(200, output)
        break
      }

      case "OPTIONS": {
        return Response(200)
      }
    }
    return Promise.resolve(new NotImplementedError("Not implemented handler").response())
  } catch (err) {
    logger.error("Error: ", err)
    return Promise.resolve(new UnexpectedError("Something went wrong").response())
  }
}
