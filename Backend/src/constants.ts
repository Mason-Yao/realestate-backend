export const CRM_TABLE_NAME = process.env.CRM_TABLE_NAME || "CRM"
export const CRM_TABLE_NAME_INDEX = "name-index"
export const CRM_TABLE_EMAIL_INDEX = "email-index"
export const CRM_TABLE_PHONE_INDEX = "phone-index"
export const CRM_TABLE_LAST_EDIT_INDEX = "modified-date-index"

export const CRM_PROPERTY_TABLE_NAME = process.env.CRM_PROPERTY_TABLE_NAME || "CRM-Property"
export const CRM_PROPERTY_TABLE_CREATE_DATE_INDEX = "create-date-index"
export const CRM_PROPERTY_TABLE_SUBURB_INDEX = "suburb-index"
export const CRM_PROPERTY_TABLE_STATE_INDEX = "state-index"

export const CRM_BUCKET_NAME = process.env.CRM_BUCKET_NAME

export const DEFAULT_PAGE_SIZE = 20

export const HEADER_PAGINATION_ENABLED = "x-pagination-enabled"
export const HEADER_PAGINATION_PER_PAGE = "x-pagination-per-page"

export const NUMBER_RANGE = {
  area: { minimum: 0, maximum: 99999, example: 50000 },
  price: { minimum: 0, maximum: 999999999999, example: 500000 },
  rooms: { minimum: 0, maximum: 20, example: 4 },
  year: { minimum: 1800, maximum: 3000, example: 2015 },
}
