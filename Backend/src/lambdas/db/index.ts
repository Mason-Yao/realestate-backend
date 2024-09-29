import {
  CreateTableCommand,
  CreateTableCommandInput,
  DeleteTableCommand,
  DeleteTableCommandInput,
  DynamoDBClient,
  DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb"
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb"
import { logger } from "../../../../Shared/Utils"

// Jest Mock DynamoDB
const isMockTest = process.env.JEST_WORKER_ID && process.env.IS_MOCK
const config: DynamoDBClientConfig = {
  ...(isMockTest && {
    endpoint: "http://localhost:8000",
    sslEnabled: false,
    region: "local-env",
    credentials: {
      accessKeyId: "fakeMyKeyId",
      secretAccessKey: "fakeSecretAccessKey",
    },
  }),
}
// TODO: Recommendation: Avoid using any
// TODO: investigate do we need sort key
// TODO: pagination for list

export interface DbOutput {
  statusCode: number
  data?: {
    items: Record<string, any>[]
    count: number
    scannedCount?: number
    lastEvaluatedKey?: Record<string, any>
  }
  errorMessage?: string
}

export interface DBQueryBuilderInput {
  key: string
  value?: string | string[]
  minimum?: number
  maximum?: number
  operator: DBQueryOperator
}

export interface DBQueryBuilderResult {
  FilterExpression: string[]
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, any>
}

export type DBQueryOperator =
  | "EQUAL"
  | "NOT_EQUAL"
  | "EXISTS"
  | "NOT_EXIST"
  | "BEGIN_WITH"
  | "CONTAINS"
  | "GREATER_THAN"
  | "GREATER_AND_EQUAL_THAN"
  | "LESS_THAN"
  | "LESS_AND_EQUAL_THAN"
  | "BETWEEN_AND"
  | "IN"

export default class DynamoDB {
  client: DynamoDBClient
  dynamo: DynamoDBDocumentClient
  constructor() {
    this.client = new DynamoDBClient(config)
    logger.info("DynamoDB config file is:" + JSON.stringify(config))
    this.dynamo = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        convertEmptyValues: true,
      },
    })
  }
  async dbPut(props: PutCommandInput): Promise<DbOutput> {
    logger.debug("dbPut params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new PutCommand(props))
      logger.info("[DB] dbPut: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbBatchWrite(props: BatchWriteCommandInput): Promise<DbOutput> {
    logger.debug("dbBatchWrite params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new BatchWriteCommand(props))
      logger.info("[DB] dbBatchWrite: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbDelete(props: DeleteCommandInput): Promise<DbOutput> {
    logger.debug("dbDelete params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new DeleteCommand(props))
      logger.info("[DB] dbDelete: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbGet(props: GetCommandInput): Promise<DbOutput> {
    logger.debug("dbGet params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new GetCommand(props))
      logger.info("[DB] dbGet: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: {
          items: response.Item ? [response.Item] : [],
          count: 1,
        },
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  // TODO: this function is not implemented and not used yet
  async dbScan(props: ScanCommandInput): Promise<DbOutput> {
    logger.debug("dbScan params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new ScanCommand(props))
      logger.info("[DB] dbScan: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: {
          items: response.Items || [],
          count: response.Count || 0,
          scannedCount: response.ScannedCount,
          lastEvaluatedKey: response.LastEvaluatedKey,
        },
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbQuery(props: QueryCommandInput): Promise<DbOutput> {
    logger.debug("dbQuery params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new QueryCommand(props))
      logger.info("[DB] dbQuery: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: {
          items: response.Items as [],
          count: response.Count ? response.Count : 0,
          scannedCount: response.ScannedCount ? response.ScannedCount : 0,
          lastEvaluatedKey: response.LastEvaluatedKey,
        },
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbTableCreate(props: CreateTableCommandInput): Promise<DbOutput> {
    logger.debug("dbTableCreate params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new CreateTableCommand(props))
      logger.info("[DB] dbTableCreate: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbTableDelete(props: DeleteTableCommandInput): Promise<DbOutput> {
    logger.debug("dbTableDelete params: " + JSON.stringify(props))
    try {
      const response = await this.dynamo.send(new DeleteTableCommand(props))
      logger.info("[DB] dbTableDelete: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  static dbQueryBuilder(inputs: DBQueryBuilderInput[], condition: "AND" | "OR"): Partial<QueryCommandInput> {
    const filterExpressions: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    inputs.forEach((input) => {
      const { key, minimum, maximum, value, operator } = input
      if (value && !Array.isArray(value)) {
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = value
      }
      switch (operator) {
        case "EQUAL":
          filterExpressions.push(`#${key} = :${key}`)
          break
        case "NOT_EQUAL":
          filterExpressions.push(`#${key} <> :${key}`)
          break
        case "GREATER_THAN":
          filterExpressions.push(`#${key} > :${key}`)
          break
        case "GREATER_AND_EQUAL_THAN":
          filterExpressions.push(`#${key} >= :${key}`)
          break
        case "LESS_THAN":
          filterExpressions.push(`#${key} < :${key}`)
          break
        case "LESS_AND_EQUAL_THAN":
          filterExpressions.push(`#${key} <= :${key}`)
          break
        case "EXISTS":
          filterExpressions.push(`attribute_exists (${key})`)
          break
        case "NOT_EXIST":
          filterExpressions.push(`attribute_not_exists (${key})`)
          break
        case "BEGIN_WITH":
          filterExpressions.push(`begins_with (${key})`)
          break
        case "CONTAINS":
          filterExpressions.push(`contains (${key})`)
          break
        case "BETWEEN_AND":
          filterExpressions.push(`#${key} BETWEEN :${key}_min AND :${key}_max`)
          expressionAttributeNames[`#${key}`] = key
          expressionAttributeValues[`:${key}_min`] = minimum
          expressionAttributeValues[`:${key}_max`] = maximum
          break
        case "IN":
          // if value is not empty, convert it to DynamoDB operand for operator "IN" case
          // https://stackoverflow.com/questions/40283653/how-to-use-in-statement-in-filterexpression-using-array-dynamodb
          if (value && Array.isArray(value) && value.length > 0) {
            expressionAttributeNames[`#${key}`] = key
            value.forEach((item, index) => {
              expressionAttributeValues[`:${index}${key}`] = item
            })
            const pattern = new RegExp("^:\\d" + key)
            filterExpressions.push(
              `#${key} IN (${Object.keys(expressionAttributeValues)
                .filter((item) => pattern.test(item))
                .toString()})`
            )
          }
          break
        default:
          logger.error("Unexpected operator: ", operator)
          break
      }
    })

    return {
      FilterExpression: filterExpressions.length > 0 ? filterExpressions.join(` ${condition} `) : undefined,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
    }
  }
}
