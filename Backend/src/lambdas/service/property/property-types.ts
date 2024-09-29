/* eslint-disable indent */
import { JsonSchemaType, JsonSchema } from "../../common/json"
import { PROPERTY_SOURCE_TYPE, PROPERTY_STATUS, PROPERTY_TYPE} from "../../../../../Shared/Interface/property"
import { NUMBER_RANGE } from "../../../constants"

export const coordinateSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    lat: {
      type: JsonSchemaType.NUMBER,
      minimum: -180,
      maximum: 180,
      example: "27.29535",
    },
    lng: {
      type: JsonSchemaType.NUMBER,
      minimum: -180,
      maximum: 180,
      example: "152.58337",
    },
  },
  required: ["lat", "lng"],
  additionalProperties: false,
}

export const propertyAddressSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    street: {
      type: JsonSchemaType.STRING,
      maxLength: 100,
      example: "4 main street",
    },
    suburb: {
      type: JsonSchemaType.STRING,
      maxLength: 20,
      example: "indooroopilly",
    },
    state: {
      type: JsonSchemaType.STRING,
      maxLength: 3,
      enum: ["NSW", "QLD", "VIC", "WA", "SA", "TAS", "ACT", "NT"],
      example: "QLD",
    },
    postcode: {
      type: JsonSchemaType.STRING,
      maxLength: 4,
      example: "4000",
    },
  },
  additionalProperties: false,
}

export const propertyFileSchema: JsonSchema = {
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

const propertySchemaData = {
  type: {
    type: JsonSchemaType.STRING,
    maxLength: 20,
    enum: Object.values(PROPERTY_TYPE),
    example: PROPERTY_TYPE.APARTMENT,
  },
  status: {
    type: JsonSchemaType.STRING,
    maxLength: 20,
    enum: Object.values(PROPERTY_STATUS),
    example: PROPERTY_STATUS.SELLING,
  },
  sourceType: {
    type: JsonSchemaType.STRING,
    maxLength: 20,
    enum: Object.values(PROPERTY_SOURCE_TYPE),
    example: PROPERTY_SOURCE_TYPE.ESTABLISHED,
  },
  cityCouncil: {
    type: JsonSchemaType.STRING,
    maxLength: 50,
    example: "Brisbane City Council",
  },
  yearBuilt: {
    type: JsonSchemaType.NUMBER,
    minimum: 1800,
    maximum: 3000,
    example: 2015,
  },
  coordinates: coordinateSchema,
  bedrooms: {
    type: JsonSchemaType.NUMBER,
    minimum: 0,
    maximum: 20,
    example: 4,
  },
  bathrooms: {
    type: JsonSchemaType.NUMBER,
    minimum: 0,
    maximum: 20,
    example: 2,
  },
  carSpaces: {
    type: JsonSchemaType.NUMBER,
    minimum: 0,
    maximum: 20,
    example: 2,
  },
  houseArea: {
    type: JsonSchemaType.NUMBER,
    minimum: 0,
    maximum: 99999,
    example: 210,
  },
  landArea: {
    type: JsonSchemaType.NUMBER,
    minimum: 0,
    maximum: 99999,
    example: 550,
  },
  description: {
    type: JsonSchemaType.STRING,
    example: "This house is in perfect condition.",
  },
  landPrice: {
    type: JsonSchemaType.NUMBER,
    minimum: 0,
    maximum: 999999999999,
    example: "500000",
  },
  housePrice: {
    type: JsonSchemaType.NUMBER,
    minimum: 0,
    maximum: 999999999999,
    example: "800000",
  },
  settlementTime: {
    type: JsonSchemaType.STRING,
    maximum: 100,
    example: "2025-03-05",
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
  agent: {
    type: JsonSchemaType.STRING,
    maximum: 100,
    example: "david",
  },
  solicitor: {
    type: JsonSchemaType.STRING,
    maximum: 100,
    example: "Mr. Lee",
  },
}

export const addPropertyBodySchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    address: {
      ...propertyAddressSchema,
      required: ["street", "suburb", "state", "postcode"],
      additionalProperties: false,
    },
    ...propertySchemaData,
    POIs: {
      type: JsonSchemaType.ARRAY,
      items: {
        type: JsonSchemaType.OBJECT,
        properties: {
          id: {
            type: JsonSchemaType.STRING,
            maxLength: 100,
          },
          name: {
            type: JsonSchemaType.STRING,
            maxLength: 100,
          },
          coordinates: coordinateSchema,
          address: {
            type: JsonSchemaType.STRING,
            maxLength: 200,
          },
          distance: {
            type: JsonSchemaType.STRING,
            maxLength: 100,
          },
          duration: {
            type: JsonSchemaType.STRING,
            maxLength: 100,
          },
          rating: {
            type: JsonSchemaType.NUMBER,
            minimum: 0,
            maximum: 100,
          },
          types: {
            type: JsonSchemaType.ARRAY,
            items: {
              type: JsonSchemaType.STRING,
              maxLength: 100,
            },
          },
          user_ratings_total: {
            type: JsonSchemaType.NUMBER,
            minimum: 0,
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
    files: {
      type: JsonSchemaType.ARRAY,
      items: {
        type: JsonSchemaType.OBJECT,
        properties: {
          ...propertyFileSchema.properties,
        },
      },
    },
  },
  required: ["address", "type", "sourceType"],
  additionalProperties: false,
}

export const getPropertyPathSchema: JsonSchema = {
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

const getNumberRangeSchemaByType = (type: keyof typeof NUMBER_RANGE) => {
  return {
    type: JsonSchemaType.OBJECT,
    properties: {
      minimum: { type: JsonSchemaType.NUMBER, ...NUMBER_RANGE[type] },
      maximum: { type: JsonSchemaType.NUMBER, ...NUMBER_RANGE[type] },
    },
  }
}

const getMultiSelectionSchema = <T extends object>(maxLength: number, example: string, enumType?: T): JsonSchema => {
  return enumType
    ? {
        type: JsonSchemaType.ARRAY,
        items: {
          type: JsonSchemaType.STRING,
          maxLength: maxLength,
          enum: Object.values(enumType),
        },
        example: example,
      }
    : {
        type: JsonSchemaType.ARRAY,
        items: {
          type: JsonSchemaType.STRING,
          maxLength: maxLength,
        },
        example: example,
      }
}

export const propertyFilterSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    street: getMultiSelectionSchema(50, "[4 main street, 100 Queen Street]"),
    type: getMultiSelectionSchema(20, `[${PROPERTY_TYPE.APARTMENT},${PROPERTY_TYPE.HOUSE}]`, PROPERTY_TYPE),
    status: getMultiSelectionSchema(20, `[${PROPERTY_STATUS.SOLD}, ${PROPERTY_STATUS.SELLING}]`, PROPERTY_STATUS),
    sourceType: getMultiSelectionSchema(30, `[${PROPERTY_SOURCE_TYPE.ESTABLISHED},${PROPERTY_SOURCE_TYPE.NEW}]`, PROPERTY_SOURCE_TYPE),
    cityCouncil: getMultiSelectionSchema(30, "[Brisbane City Council, Logan City Council]"),
    state: getMultiSelectionSchema(10, "[QLD, NSW]"),
    suburb: getMultiSelectionSchema(20, "[Wishart, Sunnybank]"),
    postcode: getMultiSelectionSchema(4, "[4000, 3000]"),
    createdBy: getMultiSelectionSchema(20, "[David, Ryan]"),
    agent: getMultiSelectionSchema(20, "[David, Ryan]"),
    coordinates: coordinateSchema,
    description: {
      type: JsonSchemaType.STRING,
      example: "This house is in perfect condition.",
    },
    yearBuilt: getNumberRangeSchemaByType("year"),
    bedrooms: getNumberRangeSchemaByType("rooms"),
    bathrooms: getNumberRangeSchemaByType("rooms"),
    carSpaces: getNumberRangeSchemaByType("rooms"),
    houseArea: getNumberRangeSchemaByType("area"),
    landArea: getNumberRangeSchemaByType("area"),
    landPrice: getNumberRangeSchemaByType("price"),
    housePrice: getNumberRangeSchemaByType("price"),
    // TODO: add data/time filter method and modify corresponding schema
    settlementTime: {
      type: JsonSchemaType.STRING,
      maximum: 100,
      example: "2025-03-05",
    },
    createdDate: {
      type: JsonSchemaType.STRING,
      maximum: 100,
      example: "2023-07-10T11:14:18.148Z",
    },
    solicitor: {
      type: JsonSchemaType.STRING,
      maximum: 100,
      example: "Mr. Lee",
    },
  },
}

export const listPropertiesParameterSchema: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  properties: {
    filter: {
      type: JsonSchemaType.OBJECT,
      properties: {
        ...propertyAddressSchema.properties,
        ...propertyFilterSchema.properties,
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
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

export const PROPERTY_PK = "Property"

export const FILE_PK = "File"
