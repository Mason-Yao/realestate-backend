import { FileDetails } from "../../../../../Shared/Interface/file"
import { jsonParser, logger } from "../../../../../Shared/Utils"
import { CRM_BUCKET_NAME, CRM_PROPERTY_TABLE_NAME } from "../../../constants"
import { BadRequestError, LambdaEvent, NotImplementedError, Response, SetCorsOriginHeader, UnexpectedError } from "../../common"
import { validateEventInput } from "../../common/util"
import FileManager from "./file"
import { addFilesBodySchema, deleteFileBodySchema, deleteFilePathSchema, fileSchema, getFilePathSchema, requestPresignedUrlParameterSchema } from "./file-types"

//-------------------------------------------------------------------------------------
export async function handler(event: LambdaEvent) {
  try {
    logger.info("Event: ", event)
    SetCorsOriginHeader(event.headers.origin)

    const TABLE_NAME = event.test?.TableName || CRM_PROPERTY_TABLE_NAME

    if (!CRM_BUCKET_NAME) {
      throw new Error("Bucket name cannot be undefined.")
    }
    const fileManager = new FileManager(TABLE_NAME, CRM_BUCKET_NAME)

    switch (event.httpMethod) {
      case "POST": {
        // Add a file
        logger.info("[Service] Add file(s)")
        const item: Array<Omit<FileDetails, "id" | "PK">> = jsonParser(event.body)
        if (!validateEventInput(item, addFilesBodySchema)) {
          return Promise.resolve(new BadRequestError("Not a valid add file request").response())
        }
        const output = await fileManager.addFiles(item)
        logger.info("[Service] Add: " + JSON.stringify(output))
        if (output.files?.items && output.files.items.length > 0) {
          return Response(200, { files: output.files })
        }
        return Promise.resolve(new UnexpectedError(output.error?.message).response())
      }

      case "GET": {
        if (event.resource == "/file/upload") {
          logger.info("[Service] Prepare to get Pre-signed urls")
          const param = event.queryStringParameters
          if (param && param.numOfUrlRequests) {
            try {
              param.numOfUrlRequests = Number(param.numOfUrlRequests)
            } catch (error) {
              return Promise.resolve(new BadRequestError("Not a valid presigned url request, num must be a valid number").response())
            }
          }
          if (param && !validateEventInput(param, requestPresignedUrlParameterSchema)) {
            return Promise.resolve(new BadRequestError("Not a valid presigned url request, exceeds max request number ").response())
          }
          const output = await fileManager.getUploadPresignedUrl(param.numOfUrlRequests)
          return Response(200, { data: output })
        } else if (event.resource == "/file/{id}") {
          logger.info("[Service] Get a single file")
          const input = event.pathParameters
          if (!validateEventInput(input, getFilePathSchema)) {
            return Promise.resolve(new BadRequestError("Not a valid get file request").response())
          }
          // GET file from a id
          const output = await fileManager.getFileById(input.id)
          logger.info("[Service] Get: " + JSON.stringify(output))
          if (output.files) {
            return Response(200, { files: output.files })
          }
          return Promise.resolve(new UnexpectedError(output.error?.message).response())
        }
        return Promise.resolve(new NotImplementedError("Not implemented handler").response())
      }

      case "PUT": {
        logger.info(`[Service] Edit file id: ${event.pathParameters.id}`)
        const inputPath = event.pathParameters
        if (!validateEventInput(inputPath, getFilePathSchema)) {
          return Promise.resolve(new BadRequestError("Not a valid URL path in the request").response())
        }
        const item: Omit<FileDetails, "PK" | "id"> = jsonParser(event.body)
        if (!validateEventInput(item, fileSchema)) {
          return Promise.resolve(new BadRequestError("Not a valid update file request body").response())
        }
        const output = await fileManager.updateFile(inputPath.id, item)
        logger.info("[Service] Put: " + JSON.stringify(output))
        return Response(200, { files: output.files })
      }

      case "DELETE": {
        if (event.resource == "/file/{id}") {
          logger.info("[Service] Delete a single file")
          const item = event.pathParameters
          if (!validateEventInput(item, deleteFilePathSchema)) {
            return Promise.resolve(new BadRequestError("Not a valid delete file request").response())
          }
          // DELETE file from a id
          const output = await fileManager.deleteFile(item.id)
          logger.info("[Service] Delete: " + JSON.stringify(output))
          return Response(200, output)
        } else {
          logger.info("[Service] Delete files")
          const fileIds = jsonParser(event.body)
          if (!validateEventInput(fileIds, deleteFileBodySchema)) {
            return Promise.resolve(new BadRequestError("Not a valid delete files request").response())
          }
          // Ensure the provided input is an array
          if (!Array.isArray(fileIds)) {
            return Promise.resolve(new BadRequestError("Expected an array of file IDs").response())
          }
          const results = await Promise.all(
            fileIds.map(async (id) => {
              const output = await fileManager.deleteFile(id)
              logger.info(`[Service] Deleted file id ${id} from DynamoDB: ${JSON.stringify(output)}`)
              return output
            })
          )
          return Response(200, results)
        }
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
