import { Schema, Validator } from "jsonschema"
import { logger } from "../../../../Shared/Utils"

export function validateEventInput(input: object, schema: Schema) {
  const schemaValidator = new Validator()
  const validator = schemaValidator.validate(input, schema)
  if (!validator.valid) {
    logger.error("Validation error: ", validator.errors)
  }
  return validator.valid
}
