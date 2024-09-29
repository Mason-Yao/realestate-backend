import { JsonSchemaType, JsonSchema } from "../../common/json"

export const emailServiceBodySchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    subject: {
      type: JsonSchemaType.STRING,
      example: "Email Subject",
    },
    sender: {
      type: JsonSchemaType.STRING,
      format: "email",
      example: "john.smith@gmail.com",
    },
    receivers: {
      type: JsonSchemaType.ARRAY,
      minItems: 1,
      items: {
        type: JsonSchemaType.STRING,
        format: "email",
      },
    },
    replyTo: {
      type: JsonSchemaType.ARRAY,
      items: {
        type: JsonSchemaType.STRING,
        format: "email",
      },
    },
    ccTo: {
      type: JsonSchemaType.ARRAY,
      items: {
        type: JsonSchemaType.STRING,
        format: "email",
      },
    },
    content: {
      type: JsonSchemaType.STRING,
      example: "<h1>Email Headline</h1>",
    },
  },
  required: ["subject", "sender", "receivers", "content"],
  additionalProperties: false,
}
