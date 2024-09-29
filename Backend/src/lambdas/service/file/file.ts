import { DeleteCommandInput, GetCommandInput, PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from "uuid"
import { FileDetails, PresignedUrlOutput } from "../../../../../Shared/Interface/file"
import { logger, removeUndefinedKey } from "../../../../../Shared/Utils"
import DynamoDB, { DbOutput } from "../../db"
import S3, { S3Output } from "../../s3"
import { FILE_PK } from "./file-types"

export interface FileOutput {
  files?: {
    items?: FileDetails[]
    urls?: PresignedUrlOutput
  }
  error?: {
    code: number
    message?: string
  }
}

export default class FileManager {
  private dynamodb: DynamoDB
  private tableName: string
  private s3: S3

  constructor(tableName: string, bucketName: string) {
    this.dynamodb = new DynamoDB()
    this.tableName = tableName
    this.s3 = new S3(bucketName)
  }

  async addFiles(inputs: Array<Omit<FileDetails, "id" | "PK">>, props?: PutCommandInput): Promise<FileOutput> {
    const items: FileDetails[] = inputs.map((input) => ({
      PK: FILE_PK,
      id: uuidv4(),
      ...input,
    }))

    const chunkSize = 25 // max items per batchWrite
    const chunkedItems = []
    for (let i = 0; i < items.length; i += chunkSize) {
      chunkedItems.push(items.slice(i, i + chunkSize))
    }

    for (const chunk of chunkedItems) {
      const writeRequests = chunk.map((item) => ({
        PutRequest: {
          Item: removeUndefinedKey(item),
        },
      }))
      const output = await this.dynamodb.dbBatchWrite({
        RequestItems: {
          [this.tableName]: writeRequests,
        },
        ...props,
      })
      logger.info("[Logic] Add: " + JSON.stringify(output))
      if (output.statusCode !== 200) {
        return FileManager.Error(output)
      }
    }
    return {
      files: {
        items: items,
      },
    }
  }

  async getFileById(id: string, props?: GetCommandInput): Promise<FileOutput> {
    const output = await this.dynamodb.dbGet({
      TableName: this.tableName,
      Key: { PK: FILE_PK, id },
      ...props,
    })
    logger.info("[Logic] Get: " + JSON.stringify(output))

    if (output.statusCode == 200) {
      return FileManager.Result(output) 
    }
    return FileManager.Error(output)
  }

  async updateFile(id: string, input: Omit<FileDetails, "id" | "PK">, props?: PutCommandInput): Promise<FileOutput> {
    // Query item to see if it exists before update
    const getOutput = await this.dynamodb.dbGet({
      TableName: this.tableName,
      Key: { PK: FILE_PK, id },
    })
    if (getOutput.statusCode !== 200 || (getOutput.data?.items as []).length == 0) {
      return FileManager.Error(getOutput, "The file does not exist")
    }

    const item: FileDetails = { PK: FILE_PK, id, ...input }
    const output = await this.dynamodb.dbPut({
      TableName: this.tableName,
      Item: removeUndefinedKey(item),
      ...props,
    })
    logger.info("[Logic] Put: " + JSON.stringify(output))
    if (output.statusCode == 200) {
      return {
        files: {
          items: [item],
        },
      }
    }
    return FileManager.Error(output)
  }

  async deleteFile(id: string, props?: DeleteCommandInput): Promise<FileOutput> {
    logger.info("[Logic] File will be deleted, id: ", id)
    await this.dynamodb.dbDelete({
      TableName: this.tableName,
      Key: { PK: FILE_PK, id },
      ...props,
    })
    return {}
  }

  /*
    numOfUrlRequests: This parameter indicates the number of presigned urls needed when uploading multiple objects.
    For each object, it will ask s3 for a presigned url, and return a Promise.all() for all urls.
  */
  async getUploadPresignedUrl(numOfUrlRequests = 1) {
    const result: PresignedUrlOutput[] = []

    logger.info(`[Logic] Prepare to get ${numOfUrlRequests} presigned urls`)
    const generateUrlPromises = Array.from({ length: numOfUrlRequests }).map(async (_, _i) => {
      const path = uuidv4()
      const response = await this.s3.getPresignedUrl(path)
      if (response.statusCode === 200) {
        result.push({
          url: response.data?.url,
          path: path,
        })
      } else {
        throw FileManager.Error(response)
      }
    })
    await Promise.all(generateUrlPromises)
    logger.info("Presigned URL: ", result)
    return {
      urls: result,
    }
  }

  //---------------------------------------------------------------------------
  // PRIVATE HELPER FUNCTIONS
  //---------------------------------------------------------------------------

  private static Error(output: DbOutput | S3Output, message?: string): FileOutput {
    return {
      error: {
        code: output.statusCode,
        message: message || output.errorMessage,
      },
    }
  }

  private static Result(output: DbOutput): FileOutput {
    return {
      files: {
        items: output.data ? (output.data.items as FileDetails[]) : [],
      },
    }
  }
}
