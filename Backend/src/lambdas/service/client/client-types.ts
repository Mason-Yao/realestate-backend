import { JsonSchemaType, JsonSchema } from "../../common/json"
import { CLIENT_SEARCH_SCOPE, GENDER, KNOWN_BY, SOCIAL_MEDIA, VISA_STATUS } from "../../../../../Shared/Interface/client"

export const addClientBodySchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    name: {
      type: JsonSchemaType.STRING,
      maxLength: 50,
      example: "John Smith",
    },
    email: {
      type: JsonSchemaType.STRING,
      format: "email",
      maxLength: 50,
      example: "john.smith@gmail.com",
    },
    phone: {
      type: JsonSchemaType.STRING,
      minLength: 3,
      maxLength: 20,
      example: "0412345678",
    },
    dob: {
      type: JsonSchemaType.STRING,
      description: "Date of birth, formatting toISOString",
      maxLength: 50,
      example: "2000-09-03T00:00:00.000Z",
    },
    category: {
      type: JsonSchemaType.STRING,
      description: "category name from settings",
      maxLength: 50,
      example: "category_0",
    },
    createdBy: {
      type: JsonSchemaType.STRING,
      maxLength: 50,
      example: "Dave",
    },
    gender: {
      type: JsonSchemaType.STRING,
      maxLength: 20,
      enum: Object.values(GENDER),
      example: GENDER.Male,
    },
    knownBy: {
      type: JsonSchemaType.STRING,
      maxLength: 20,
      enum: Object.values(KNOWN_BY),
      example: KNOWN_BY.SocialEvent,
    },
    notes: {
      type: JsonSchemaType.STRING,
      example: "This is notes",
    },
    reminderID: {
      type: JsonSchemaType.STRING,
      maxLength: 20,
      example: "cef895d0-465f-11ee-be56-0242ac120002",
    },
    visa: {
      type: JsonSchemaType.STRING,
      maxLength: 30,
      enum: Object.values(VISA_STATUS),
      example: VISA_STATUS.Working,
    },
    social: {
      type: JsonSchemaType.ARRAY,
      items: {
        type: JsonSchemaType.OBJECT,
        properties: {
          name: {
            type: JsonSchemaType.STRING,
            maxLength: 30,
            enum: Object.values(SOCIAL_MEDIA),
          },
          value: {
            type: JsonSchemaType.STRING,
            maxLength: 100,
          },
        },
      },
      // relationships
      // properties
    },
  },
  required: ["name"],
  // TODO: We should more strict on this!
  additionalProperties: true,
}

export const getClientPathSchema: JsonSchema = {
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

export const queryClientPathSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    keyword: {
      type: JsonSchemaType.STRING,
      minLength: 1,
      example: "dave",
    },
    scope: {
      type: JsonSchemaType.STRING,
      enum: Object.values(CLIENT_SEARCH_SCOPE),
      example: CLIENT_SEARCH_SCOPE.FAST,
    },
  },
  required: ["keyword"],
  additionalProperties: false,
}

export const filterClientPathSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    lastModifiedDate: {
      type: JsonSchemaType.STRING,
    },
    category: {
      type: JsonSchemaType.STRING,
    },
    createdDate: {
      type: JsonSchemaType.STRING,
    },
    gender: {
      type: JsonSchemaType.STRING,
    },
    visa: {
      type: JsonSchemaType.STRING,
    },
    knownBy: {
      type: JsonSchemaType.STRING,
    },
    hasValid: {
      type: JsonSchemaType.STRING,
    },
  },
  additionalProperties: false,
}

export const listClientsParameterSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    filter: {
      type: JsonSchemaType.OBJECT,
      properties: {
        category: {
          type: JsonSchemaType.STRING,
          description: "category name from settings",
          maxLength: 50,
          example: "category_0",
        },
        gender: {
          type: JsonSchemaType.STRING,
          maxLength: 20,
          enum: Object.keys(GENDER),
          example: GENDER.Male,
        },
        visa: {
          type: JsonSchemaType.STRING,
          maxLength: 30,
          enum: Object.keys(VISA_STATUS),
          example: VISA_STATUS.Working,
        },
        knownBy: {
          type: JsonSchemaType.STRING,
          maxLength: 20,
          enum: Object.keys(KNOWN_BY),
          example: KNOWN_BY.SocialEvent,
        },
        createdBy: {
          type: JsonSchemaType.STRING,
          maxLength: 20,
        },
        dob: {
          type: JsonSchemaType.STRING,
          description: "Date of birth, formatting toISOString",
          maxLength: 50,
          example: "2000-09-03T00:00:00.000Z",
        },
        hasValid: {
          type: JsonSchemaType.ARRAY,
          items: {
            type: JsonSchemaType.STRING,
          },
        },
        lastModifiedDate: {
          type: JsonSchemaType.OBJECT,
          properties: {
            minimum: {
              type: JsonSchemaType.STRING,
              description: "Last modified date, formatting toISOString",
              maxLength: 50,
              example: "2000-09-03T00:00:00.000Z",
            },
            maximum: {
              type: JsonSchemaType.STRING,
              description: "Last modified date, formatting toISOString",
              maxLength: 50,
              example: "2000-09-03T00:00:00.000Z",
            },
          },
        },
        createdDate: {
          type: JsonSchemaType.OBJECT,
          properties: {
            minimum: {
              type: JsonSchemaType.STRING,
              description: "Last modified date, formatting toISOString",
              maxLength: 50,
              example: "2000-09-03T00:00:00.000Z",
            },
            maximum: {
              type: JsonSchemaType.STRING,
              description: "Last modified date, formatting toISOString",
              maxLength: 50,
              example: "2000-09-03T00:00:00.000Z",
            },
          },
        },
      },
      additionalProperties: false,
    },
    lastEvaluatedKey: {
      type: JsonSchemaType.OBJECT,
      properties: {
        id: {
          type: JsonSchemaType.STRING,
        },
        PK: {
          type: JsonSchemaType.STRING,
        },
        lastModifiedDate: {
          type: JsonSchemaType.STRING,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

export const CLIENT_PK = "Client"
