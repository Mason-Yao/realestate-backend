import { JsonSchemaType, JsonSchema } from "../../common/json"

export const getReminderPathSchema: JsonSchema = {
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

export const addReminderBodySchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    name: {
      type: JsonSchemaType.STRING,
      example: "MyReminder",
    },
    createdBy: {
      type: JsonSchemaType.STRING,
      example: "David",
    },
    description: {
      type: JsonSchemaType.STRING,
      example: "Reminder me to call him",
    },
    reference: {
      properties: {
        PK: {
          type: JsonSchemaType.STRING,
          example: "Client",
        },
        id: {
          type: JsonSchemaType.STRING,
          example: "aaa895d0-465f-11ee-be56-0242ac120002",
        },
      },
      required: ["PK", "id"],
      additionalProperties: false,
    },
  },
  required: ["name", "lastModifiedDate"],
  additionalProperties: false,
}

export const REMINDER_PK = "Reminder"
