/*

// NOTE: FOR JR students:
// This is a example of mock unit test which testing client functions
// Please add a new test file for property functions

import { logger } from "../../../Shared/Utils/logger"
import { LambdaEvent } from "../../src/lambdas/common/index"
import { handler } from "../../src/lambdas/service/client/service-client"
import data from "./test-data/testing-data.json"

//   data
//     request
//       add: adding a client
//       list: listing all clients
//       getByID: get a client using ID
//       update: update a client using ID
//       delete: delete a client using ID
//     client:
//       testUser: test user for testing add request
//       modifiedUser: test user for testing update request


describe("Integrations with Jest-Dynamodb", () => {
  let PK: string
  let id: string
  let createdDate: string
  let lastModifiedDate: string

  test("List all clients before add", async () => {
    const output = await handler(data.request.list)
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients
    expect(clients.items.length).toEqual(0)
  })

  test("Add a client", async () => {
    let event: LambdaEvent = {
      ...data.request.add,
      body: data.client.testUser,
    }
    const output = await handler(event)
    expect(output.statusCode).toBe(200)
    PK = JSON.parse(output.body).clients.items[0].PK
    id = JSON.parse(output.body).clients.items[0].id
    createdDate = new Date().toISOString()
    lastModifiedDate = new Date().toISOString()
    expect(PK).toBe("Client")
    expect(id.length).toBeGreaterThan(0)
  })

  test("List all clients after add", async () => {
    const output = await handler(data.request.list)
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients
    expect(clients.items.length).toEqual(1)
    expect(clients.items[0].id).toEqual(id)
    id = clients.items[0].id
  })

  test("Get a client", async () => {
    let event: LambdaEvent = {
      ...data.request.getByID,
      pathParameters: {
        id: id,
      },
    }
    const output = await handler(event)
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients
    expect(clients.items.length).toEqual(1)
    expect(clients.items[0]).toEqual({
      PK: "Client",
      id: id,
      createdDate: createdDate,
      lastModifiedDate: lastModifiedDate,
      ...data.client.testUser,
    })
  })

  test("Update a client", async () => {
    let event: LambdaEvent = {
      ...data.request.update,
      body: { ...data.client.modifiedUser, createdDate: createdDate },
      pathParameters: {
        id: id,
      },
    }
    lastModifiedDate = new Date().toISOString()
    const output = await handler(event)
    expect(output.statusCode).toBe(200)
  })

  test("Get a client after update", async () => {
    let event: LambdaEvent = {
      ...data.request.getByID,
      pathParameters: {
        id: id,
      },
    }
    const output = await handler(event)
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients
    expect(clients.items.length).toEqual(1)
    expect(clients.items[0]).toEqual({
      PK: "Client",
      id: id,
      createdDate: createdDate,
      lastModifiedDate: lastModifiedDate,
      ...data.client.modifiedUser,
    })
  })

  test("Delete a client", async () => {
    let event: LambdaEvent = {
      ...data.request.deleteByID,
      pathParameters: {
        id: id,
      },
    }
    const output = await handler(event)
    expect(output.statusCode).toBe(200)
  })

  test("List all clients after delete", async () => {
    const output = await handler(data.request.list)
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients
    expect(clients.items.length).toEqual(0)
  })
})
*/
