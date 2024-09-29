import { JsonSchema, JsonSchemaType } from "../../common/json"

export const fileSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    PK: {
      type: JsonSchemaType.STRING,
      example: "File",
    },
    id: {
      type: JsonSchemaType.STRING,
      example: "cef895d0-465f-11ee-be56-0242ac120002",
    },
    path: {
      type: JsonSchemaType.STRING,
      example: "https://crm-files-jr.s3.ap-southeast-2.amazonaws.com/a4988aef-52b1-4968-a2b1-488cd1f6f079?X-Amz-Algorithm=AWS4-HMAC-SHA256",
    },
    isCover: {
      type: JsonSchemaType.BOOLEAN,
    },
    isPublic: {
      type: JsonSchemaType.BOOLEAN,
    },
    createdBy: {
      type: JsonSchemaType.STRING,
      maximum: 100,
      example: "david",
    },
    createdDate: {
      type: JsonSchemaType.STRING,
      maximum: 100,
      example: "2023-07-10T11:14:18.148Z",
    },
    tags: {
      type: JsonSchemaType.ARRAY,
      items: {
        type: JsonSchemaType.STRING,
      },
    },
  },
  required: ["PK", "id", "path"],
  additionalProperties: false,
}

export const addFilesBodySchema: JsonSchema = {
  type: JsonSchemaType.ARRAY,
  items: {
    type: JsonSchemaType.OBJECT,
    properties: {
      ...fileSchema.properties,
    },
  },
}

export const deleteFileBodySchema: JsonSchema = {
  type: JsonSchemaType.ARRAY,
  items: {
    type: JsonSchemaType.STRING,
  },
}

export const deleteFilePathSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
}

export const getFilePathSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
}

export const listFilesParameterSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
}

export const requestPresignedUrlParameterSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    numOfUrlRequests: {
      type: JsonSchemaType.NUMBER,
      maximum: 50,
    },
  },
  additionalProperties: false,
}

export const FILE_PK = "File"
