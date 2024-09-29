import { JsonSchemaType, JsonSchema } from "../../common/json"

export const getSettingPathSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    name: {
      type: JsonSchemaType.STRING,
      example: "RMBCurrency",
    },
  },
  required: ["name"],
  additionalProperties: false,
}

export const addSettingBodySchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    name: {
      type: JsonSchemaType.STRING,
      example: "RMBCurrency",
    },
    value: {
      type: JsonSchemaType.STRING,
      example: "6.1",
    },
  },
  required: ["name", "value"],
  additionalProperties: false,
}

export const SETTINGS_PK = "Settings"
