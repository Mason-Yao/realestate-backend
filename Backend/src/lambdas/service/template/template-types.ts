import { JsonSchemaType, JsonSchema } from "../../common/json"

export const addTemplateBodySchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    name: {
      type: JsonSchemaType.STRING,
      example: "HelloTemplate",
    },
    subject: {
      type: JsonSchemaType.STRING,
      example: "Hello",
    },
    createdBy: {
      type: JsonSchemaType.STRING,
      example: "David",
    },
    template: {
      type: JsonSchemaType.STRING,
      example: "<h1>This is a hello email.</h1>",
    },
  },
  required: ["name"],
  additionalProperties: false,
}

export const getTemplatePathSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    id: {
      type: JsonSchemaType.STRING,
      example: "cef895d0-465f-11ee-be56-0242ac120002",
    },
  },
  required: ["id"],
  additionalProperties: false,
}

export const listTemplatesParameterSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    ExclusiveStartKey: {
      type: JsonSchemaType.OBJECT,
      properties: {
        id: {
          type: JsonSchemaType.STRING,
        },
        PK: {
          type: JsonSchemaType.STRING,
        },
        name: {
          type: JsonSchemaType.STRING,
        },
      },
    },
  },
  additionalProperties: false,
}

export const TEMPLATE_PK = "Template"
