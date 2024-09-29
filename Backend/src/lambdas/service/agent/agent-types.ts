import { JsonSchemaType, JsonSchema } from "../../common/json"

export const addAgentSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    username: {
      type: JsonSchemaType.STRING,
      maxLength: 50,
      example: "John@gmail.com",
    },
  },
  required: ["name"],
}

export const AGENT_PK = "Agent"
