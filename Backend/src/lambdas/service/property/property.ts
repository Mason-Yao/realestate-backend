import { DeleteCommandInput, GetCommandInput, PutCommandInput, QueryCommandInput, ScanCommandInput } from "@aws-sdk/lib-dynamodb"
import { PROPERTY_PK } from "./property-types"
import { v4 as uuidv4 } from "uuid"
import {
  Property,
  DBProperty,
  PropertyFilter,
  AUS_STATE,
  PROPERTY_TYPE,
  PROPERTY_STATUS,
  PROPERTY_SOURCE_TYPE,
  PropertyEvaluatedKey,
} from "../../../../../Shared/Interface/property"
import { logger, removeUndefinedKey, isSame } from "../../../../../Shared/Utils"
import { CRM_PROPERTY_TABLE_CREATE_DATE_INDEX, DEFAULT_PAGE_SIZE } from "../../../constants"
import DynamoDB, { DbOutput, DBQueryBuilderInput, DBQueryOperator } from "../../db"

export interface PropertyOutput {
  properties?: {
    items: Property[]
    count: number
    scannedCount?: number
    lastEvaluatedKey?: Record<string, any>
  }
  error?: {
    code: number
    message?: string
  }
}

export default class PropertyManager {
  private dynamodb: DynamoDB
  private tableName: string

  constructor(tableName: string) {
    this.dynamodb = new DynamoDB()
    this.tableName = tableName
  }

  async addProperty(input: Omit<Property, "id" | "PK">, props?: PutCommandInput): Promise<PropertyOutput> {
    const item: Property = {
      PK: PROPERTY_PK,
      id: uuidv4(),
      ...input,
      createdDate: new Date().toISOString(),
    }

    const output = await this.dynamodb.dbPut({
      TableName: this.tableName,
      Item: removeUndefinedKey(PropertyManager.transformToDBProperty(item)),
      ...props,
    })
    logger.info("[Logic] Add: " + JSON.stringify(output))
    if (output.statusCode == 200) {
      return {
        properties: {
          items: [item],
          count: 1,
        },
      }
    }
    return PropertyManager.Error(output)
  }

  async updateProperty(id: string, input: Omit<Property, "id" | "PK">, props?: PutCommandInput): Promise<PropertyOutput> {
    // Query item to see if it exists before update
    const getOutput = await this.dynamodb.dbGet({
      TableName: this.tableName,
      Key: { PK: PROPERTY_PK, id },
    })
    if (getOutput.statusCode !== 200 || (getOutput.data?.items as []).length == 0) {
      return PropertyManager.Error(getOutput, "The property does not exist")
    }

    const item: Property = { PK: PROPERTY_PK, id, ...input }
    const output = await this.dynamodb.dbPut({
      TableName: this.tableName,
      Item: removeUndefinedKey(PropertyManager.transformToDBProperty(item)),
      ...props,
    })
    logger.info("[Logic] Put: " + JSON.stringify(output))
    if (output.statusCode == 200) {
      return {
        properties: {
          items: [item],
          count: 1,
        },
      }
    }
    return PropertyManager.Error(output)
  }

  async getPropertyById(id: string, props?: GetCommandInput): Promise<PropertyOutput> {
    const output = await this.dynamodb.dbGet({
      TableName: this.tableName,
      Key: { PK: PROPERTY_PK, id },
      ...props,
    })
    logger.info("[Logic] Get: " + JSON.stringify(output))

    if (output.statusCode == 200) {
      return PropertyManager.Result(output)
    }
    return PropertyManager.Error(output)
  }

  async listProperties(filter?: PropertyFilter, pageSize = DEFAULT_PAGE_SIZE, startEvaluatedKey?: PropertyEvaluatedKey): Promise<PropertyOutput> {
    const filterExpression = PropertyManager.buildFilterExpression(filter)

    // build up the list, dynamodb query filter result may less than Limit specified
    let items = []
    let lastEvaluatedKey = startEvaluatedKey
    let scannedCount = 0
    while (items.length < pageSize) {
      logger.info("lastEvaluatedKey = ", lastEvaluatedKey)
      const output = await this.dynamodb.dbQuery({
        TableName: this.tableName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: {
          "#pk": "PK",
          ...filterExpression.ExpressionAttributeNames,
        },
        ExpressionAttributeValues: {
          ":pk": PROPERTY_PK,
          ...filterExpression.ExpressionAttributeValues,
        },
        FilterExpression: filterExpression.FilterExpression,
        Limit: pageSize,
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false, // descending order
      })

      // any error, we return the error code
      if (!output.statusCode || output.statusCode != 200) {
        return PropertyManager.Error(output)
      }

      // build up our own list
      if (output.data) {
        items.push(...output.data.items)
        lastEvaluatedKey = output.data.lastEvaluatedKey as PropertyEvaluatedKey
        scannedCount += output.data.scannedCount || 0
        // no keys means last page
        if (!lastEvaluatedKey) {
          break
        }
      }
    }

    // remove over-loaded items
    if (items.length > pageSize) {
      const key = items.slice(pageSize - 1, pageSize)[0]
      lastEvaluatedKey = {
        PK: PROPERTY_PK,
        id: key.id,
      }
      items = items.slice(0, pageSize)
    }

    const result: DbOutput = {
      statusCode: 200,
      data: {
        items: items,
        count: items.length,
        lastEvaluatedKey,
        scannedCount,
      },
    }
    logger.info("[Logic] List: " + JSON.stringify(result))
    return PropertyManager.Result(result)
  }

  private static buildFilterExpression(filter?: PropertyFilter): Partial<QueryCommandInput> {
    const inputs: DBQueryBuilderInput[] = []

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        // logger.info(`key = ${key}, value = ${value}`)
        switch (key) {
          case "street":
          case "suburb":
          case "state":
          case "postcode":
          case "type":
          case "status":
          case "sourceType":
          case "cityCouncil":
          case "createdBy":
          case "agent": {
            inputs.push({ key, value: value as string[], operator: "IN" })
            break
          }
          case "yearBuilt":
          case "bedrooms":
          case "bathrooms":
          case "carSpaces":
          case "houseArea":
          case "landArea":
          case "landPrice":
          case "housePrice": {
            const { minimum, maximum, exact } = value
            if (minimum && maximum) {
              inputs.push({ key, minimum, maximum, operator: "BETWEEN_AND" })
            } else if (minimum) {
              inputs.push({ key, value: minimum, operator: "GREATER_AND_EQUAL_THAN" })
            } else if (maximum) {
              inputs.push({ key, value: maximum, operator: "LESS_AND_EQUAL_THAN" })
            } else if (value) {
              inputs.push({ key, value: exact, operator: "EQUAL" })
            } else {
              inputs.push({ key, value: undefined, operator: "EXISTS" })
            }
            break
          }
          case "createdDate":
          case "settlementTime":
            const { minimum, maximum } = value
            if (minimum && maximum) {
              inputs.push({ key, minimum, maximum, operator: "BETWEEN_AND" })
            } else if (minimum) {
              inputs.push({ key, value: minimum, operator: "GREATER_AND_EQUAL_THAN" })
            } else if (maximum) {
              inputs.push({ key, value: maximum, operator: "LESS_AND_EQUAL_THAN" })
            } else {
              inputs.push({ key, value: undefined, operator: "EXISTS" })
            }
            break
          default:
            logger.error("Unexpected key: ", key)
            break
        }
      }
    }
    return DynamoDB.dbQueryBuilder(inputs, "AND")
  }

  async deleteProperty(id: string, props?: DeleteCommandInput): Promise<PropertyOutput> {
    logger.info("[Logic] Property will be deleted, id: ", id)
    await this.dynamodb.dbDelete({
      TableName: this.tableName,
      Key: { PK: PROPERTY_PK, id },
      ...props,
    })
    return {}
  }

  async getPropertyCount() {
    const output = await this.dynamodb.dbQuery({
      TableName: this.tableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": PROPERTY_PK,
      },
      Select: "COUNT",
    })
    logger.info("[Logic] Count: " + JSON.stringify(output))
    if (output.statusCode == 200) {
      return output.data ? output.data.count : 0
    }
    return PropertyManager.Error(output)
  }

  //---------------------------------------------------------------------------
  // PRIVATE HELPER FUNCTIONS
  //---------------------------------------------------------------------------
  private static transformToDBProperty(property: Property): DBProperty {
    let { address, ...contents } = property
    let db: DBProperty = contents
    if (address) {
      db = {
        ...contents,
        ...address,
      }
    }
    return db
  }

  private static transformToProperty(dbProperties: DBProperty[]): Property[] {
    const properties: Property[] = []
    dbProperties.forEach((dbProperty) => {
      const { street, suburb, state, postcode, ...contents } = dbProperty
      properties.push({
        address: {
          street,
          suburb,
          state,
          postcode,
        },
        ...contents,
      })
    })
    return properties
  }

  private static Error(output: DbOutput, message?: string): PropertyOutput {
    return {
      error: {
        code: output.statusCode,
        message: message || output.errorMessage,
      },
    }
  }

  private static Result(output: DbOutput): PropertyOutput {
    return {
      properties: {
        items: output.data ? PropertyManager.transformToProperty(output.data.items as DBProperty[]) : [],
        count: output.data ? output.data.items.length : 0,
        scannedCount: output.data ? output.data.scannedCount : undefined,
        lastEvaluatedKey: output.data ? output.data.lastEvaluatedKey : undefined,
      },
    }
  }
}
