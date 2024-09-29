import PropertyManager, {
  PropertyOutput,
} from "../../Backend/src/lambdas/service/property/property";
import {
  PROPERTY_SOURCE_TYPE,
  PropertyEvaluatedKey,
  PropertyFilter,
} from "../../Shared/Interface/property";
import { logger, jsonParser, decode, encode } from "../../Shared/Utils";

interface PropertyListParm {
  filter?: PropertyFilter;
  lastEvaluatedKey?: PropertyEvaluatedKey;
}

const property = new PropertyManager("CRM-david-Property");
const filter: PropertyFilter = {
  sourceType: PROPERTY_SOURCE_TYPE.ESTABLISHED,
  // suburb: "Woolloongabba",
  // yearBuilt: {
  //   minimum: 2005,
  //   maximum: 2011,
  // },
  // createdDate: {
  //   minimum: "2023-07",
  //   maximum: "2023-08",
  // },
  // settlementTime: {}, // <! If it is set
};

// test param encode / decode
const param: PropertyListParm = {
  filter,
  lastEvaluatedKey: {
    PK: "Property",
    id: "1e4e66c3-5bfe-41dc-a341-b8b52846ecbb",
  },
  // {
  //   PK: "Property",
  //   id: "772af0f2-89c2-4b5e-b32c-d7894a9f5a78",
  // },
};
const param1 = encode(JSON.stringify(param));
console.log("encode param =", param1);

const param2: PropertyListParm = jsonParser(decode(param1));
console.log("decode param =", param2);

property
  .listProperties(param2.filter, 2, param2.lastEvaluatedKey)
  .then((data: PropertyOutput) => {
    console.log(JSON.stringify(data, null, 2));
    console.log("Count: ", data.properties?.count);
    console.log("Scanned: ", data.properties?.scannedCount);
    console.log("LastKey: ", data.properties?.lastEvaluatedKey);
  });

// Encode example so you can test
// filter sourceType
// param encode = eyJmaWx0ZXIiOnsic291cmNlVHlwZSI6ImVzdGFibGlzaGVkIn19