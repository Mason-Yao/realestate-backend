import { DeleteCommandInput, GetCommandInput, PutCommandInput, QueryCommandInput, ScanCommandInput } from "@aws-sdk/lib-dynamodb"
import { Settings } from "../../../../../Shared/Interface/settings"
import { SETTINGS_PK } from "./settings-types"
import { v4 as uuidv4 } from "uuid"
import { logger } from "../../../../../Shared/Utils"
import { CRM_TABLE_NAME_INDEX } from "../../../constants"
import DynamoDB from "../../db"

export interface SettingsService {
  name: string
  value?: string
}

interface SettingsOutput extends Partial<Settings> {
  error?: string
}

export default class SettingsManager {
  private dynamodb: DynamoDB
  private tableName: string

  constructor(tableName: string) {
    this.dynamodb = new DynamoDB()
    this.tableName = tableName
  }

  async add(input: Omit<Settings, "id" | "PK">, props?: PutCommandInput): Promise<SettingsOutput> {
    const item: Settings = {
      PK: SETTINGS_PK,
      id: uuidv4(),
      ...input,
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
    }
    const postProps: PutCommandInput = {
      TableName: this.tableName,
      Item: item,
      ...props,
    }
    const output = await this.dynamodb.dbPut(postProps)
    logger.info("[Logic] Add: " + JSON.stringify(output))
    if (output.statusCode == 200) {
      return item
    }
    return {
      name: item.name,
      error: output.errorMessage,
    }
  }

  async update(id: string, input: Omit<Settings, "id" | "PK">, props?: PutCommandInput): Promise<SettingsOutput> {
    const item: Settings = {
      PK: SETTINGS_PK,
      id: id,
      ...input,
      lastModifiedDate: new Date().toISOString(),
    }
    const updateProps: PutCommandInput = {
      TableName: this.tableName,
      Item: item,
      ...props,
    }
    const getProps: GetCommandInput = {
      TableName: this.tableName,
      Key: { PK: SETTINGS_PK, id: id },
    }
    // Query item to see if it exists before update
    const getOutput = await this.dynamodb.dbGet(getProps)
    if (getOutput.statusCode !== 200 || (getOutput.data?.items as []).length == 0) {
      return {
        name: item.name,
        error: "The settings not exist",
      }
    }

    const output = await this.dynamodb.dbPut(updateProps)
    logger.info("[Logic] Put: " + JSON.stringify(output))
    if (output.statusCode == 200) {
      return item
    }
    return {
      name: item.name,
      error: output.errorMessage,
    }
  }

  // async getById(id: string, props?: GetCommandInput): Promise<SettingsOutput> {
  //   const getProps: GetCommandInput = {
  //     TableName: this.tableName,
  //     Key: { PK: SETTINGS_PK, id: id },
  //     ...props,
  //   }
  //   const output = await this.dynamodb.dbGet(getProps)
  //   logger.info("[Logic] Get by id: " + JSON.stringify(output))

  //   if (output.statusCode == 200) {
  //     return {
  //       templates: output.data ? (output.data as []) : [],
  //     }
  //   }
  //   return {
  //     error: output.errorMessage,
  //   }
  // }

  async getByName(namePrefix: string, props?: QueryCommandInput): Promise<SettingsOutput> {
    const queryProps: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: CRM_TABLE_NAME_INDEX,
      KeyConditionExpression: "PK = :partitionValue AND begins_with(#client_name, :sortValue)",
      ExpressionAttributeNames: { "#client_name": "name" },
      ExpressionAttributeValues: {
        ":partitionValue": SETTINGS_PK,
        ":sortValue": namePrefix,
      },
      ...props,
    }

    const output = await this.dynamodb.dbQuery(queryProps)
    logger.info("[Logic] Get by name: " + JSON.stringify(output))

    if (output.statusCode == 200) {
      if (output.data && output.data.items.length > 0) {
        const items: SettingsOutput[] = []
        for (const item of output.data.items as Settings[]) {
          items.push(item)
        }
        // should only have 1 record
        if (items.length > 0) {
          console.warn(`[Logic] Settings name ${namePrefix} has multiple values: ${items}`)
        }
        return items[0]
      }
      return {
        name: namePrefix,
        error: "Not Found",
      }
    }
    return {
      name: namePrefix,
      error: output.errorMessage,
    }
  }

  async list(props?: ScanCommandInput): Promise<SettingsOutput[]> {
    const queryProps: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: CRM_TABLE_NAME_INDEX,
      KeyConditionExpression: "PK = :partitionValue",
      ExpressionAttributeValues: {
        ":partitionValue": SETTINGS_PK,
      },
      ...props,
    }
    const output = await this.dynamodb.dbQuery(queryProps)
    logger.info("[Logic] List: " + JSON.stringify(output))

    if (output.statusCode == 200 && output.data) {
      return output.data.items
    }
    return []
  }

  async delete(id: string, props?: DeleteCommandInput): Promise<SettingsOutput> {
    const deleteProps: DeleteCommandInput = {
      TableName: this.tableName,
      Key: { PK: SETTINGS_PK, id },
      ...props,
    }
    const output = await this.dynamodb.dbDelete(deleteProps)
    logger.info("[Logic] Delete: " + JSON.stringify(output))
    if (output.statusCode == 200) {
      return {
        id,
      }
    }
    return {
      error: output.errorMessage,
    }
  }
}
