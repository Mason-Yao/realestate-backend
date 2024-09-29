import { DateFilter, NumberFilter } from "./filter";
import { FileDetails } from "./file";

export enum PROPERTY_TYPE {
  HOUSE = "house",
  APARTMENT = "apartment",
  UNIT = "unit",
  TOWNHOUSE = "townhouse",
}

export enum PROPERTY_SOURCE_TYPE {
  NEW = "new",
  ESTABLISHED = "established",
  OFF_THE_PLAN = "off the plan",
}

export enum PROPERTY_STATUS {
  SELLING = "selling", // Property is selling
  SOLD = "sold", // already sold
  MANAGE = "manage", // also manage by renting it out
}

export enum ROOM_NUMBER {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  FIVEPLUS = "5+",
}

export type AUS_STATE =
  | "NSW"
  | "QLD"
  | "VIC"
  | "WA"
  | "SA"
  | "TAS"
  | "ACT"
  | "NT";

export interface Address {
  street?: string;
  suburb?: string;
  state?: AUS_STATE;
  postcode?: string;
}

// This can be used to show selling property or property that already sold or being managed
export interface Property {
  PK: string;
  id: string;
  address: Address;
  type: PROPERTY_TYPE;
  status?: PROPERTY_STATUS;
  sourceType: PROPERTY_SOURCE_TYPE;
  cityCouncil?: string;
  yearBuilt?: number;
  coordinates: Coordinates;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  houseArea?: number;
  landArea?: number;
  description?: string;
  landPrice?: number;
  housePrice?: number;
  settlementTime?: string; // could be a string
  createdBy?: string; // who created the property
  createdDate?: string;
  agent?: string; // could be seller or maintenance agent
  solicitor?: string;
  files?: FileDetails[];
  POIs?: POI[]; // Place of interest
}

export interface PropertyFilterNumber {
  minimum?: number;
  maximum?: number;
  exact?: number;
}

export interface PropertyFilterDate {
  minimum?: string;
  maximum?: string;
}

export interface PropertyEvaluatedKey {
  PK: "Property";
  id: string;
}

export interface PropertyFilter {
  // string filter (should compare exact match)
  street?: string[];
  suburb?: string[];
  state?: AUS_STATE[];
  postcode?: string[];
  type?: PROPERTY_TYPE[];
  status?: PROPERTY_STATUS[];
  sourceType?: PROPERTY_SOURCE_TYPE[];
  cityCouncil?: string[];
  createdBy?: string[];
  agent?: string[];
  // numbers filter (number range, or exact)
  yearBuilt?: NumberFilter;
  bedrooms?: NumberFilter;
  bathrooms?: NumberFilter;
  carSpaces?: NumberFilter;
  houseArea?: NumberFilter;
  landArea?: NumberFilter;
  landPrice?: NumberFilter;
  housePrice?: NumberFilter;
  // date filter (date range only, or exist)
  settlementTime?: DateFilter;
  createdDate?: DateFilter;
}

export interface PropertyListParm {
  filter?: PropertyFilter;
  lastEvaluatedKey?: PropertyEvaluatedKey;
}

// This structure is used to save into db
export interface DBProperty extends Omit<Property, "address">, Address {}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface POI {
  id: string;
  name?: string;
  coordinates?: Coordinates;
  address?: string;
  distance?: string;
  duration?: string;
  rating?: number;
  types?: string[];
  user_ratings_total?: number;
}

export interface PropertiesPagedPayload {
  items: Property[];
  count: number;
  scannedCount: number;
  lastEvaluatedKey: Property;
}
