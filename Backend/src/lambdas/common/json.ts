import { Schema } from "jsonschema"

export enum JsonSchemaType {
  NULL = "null",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  NUMBER = "number",
  INTEGER = "integer",
  STRING = "string",
}

export interface JsonSchema extends Omit<Schema, "properties"> {
  properties?: {
    [name: string]: JsonSchema | Schema
  }
  example?: string
}
