import ClientManager, {
  ClientOutput,
} from "../../Backend/src/lambdas/service/client/client";
import { ClientFilter, ClientListParam } from "../../Shared/Interface/client";
import { decode, encode, jsonParser } from "../../Shared/Utils";

const client = new ClientManager("CRM");
// client.getClientCount().then((data) => console.log(data))

// client.searchClient("daiwei").then((data: any) => {
//   console.log(JSON.stringify(data, null, 2));
//   console.log("Count: ", data.clients?.items.length);
// });

const filter: ClientFilter = {
  gender: "Male",
  //hasValid: ["wechat"],
  //visa: "Permanent Resident",
};
// test param encode / decode
const param: ClientListParam = {
  filter,
  // lastEvaluatedKey: {
  //   PK: "Client",
  //   lastModifiedDate: "2023-07-10T11:02:50.085Z",
  //   id: "e3ed84ad-bce0-42cd-8d69-9340df034bfd",
  // },
};
const param1 = encode(JSON.stringify(param));
console.log("encode param =", param1);

const param2: ClientListParam = jsonParser(decode(param1));
console.log("decode param =", param2);

client
  .listClients(param2.filter, 20, param2.lastEvaluatedKey)
  .then((data: ClientOutput) => {
    console.log(JSON.stringify(data, null, 2));
    console.log("Count: ", data.clients?.count);
    console.log("Scanned: ", data.clients?.scannedCount);
    console.log("LastKey: ", data.clients?.lastEvaluatedKey);
  });
