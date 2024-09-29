/*

// NOTE: FOR JR students:
// This is a example of integration test which testing client functions
// Please add a new test file for property functions

import { logger } from "../../../Shared/Utils/logger"
import { LambdaEvent } from "../../src/lambdas/common"
import { handler as clientHandler } from "../../src/lambdas/service/client/service-client"
import { handler as templateHandler } from "../../src/lambdas/service/template/service-template"
import { handler as reminderHandler } from "../../src/lambdas/service/reminder/service-reminder"
import data from "./test-data/testing-data.json"
import { waitUntilTableExists, waitUntilTableNotExists } from "@aws-sdk/client-dynamodb"
import DynamoDB from "../../src/lambdas/db"
import tableData from "./test-data/table-data.json"
import { TEMPLATE_PK } from "../../src/lambdas/service/template/template-types"
import { CLIENT_PK } from "../../src/lambdas/service/client/client-types"
import { REMINDER_PK } from "../../src/lambdas/service/reminder/reminder-types"

// 
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
// 

const INTEGRATION_TEST_TABLE_NAME = {
  TableName: "CRM-Integration-Test",
}
const INTEGRATION_TEST_DB_DELAY = { maxWaitTime: 15, maxDelay: 2, minDelay: 1 }
const commonProps = {
  resource: "aws-cloudfront",
  isBase64Encoded: false,
  httpMethod: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer XYZ",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) Chrome/58.0.3029.110 Safari/537.3",
  },
  test: { ...INTEGRATION_TEST_TABLE_NAME },
}

describe("client_integration test", () => {
  let id: string
  let reminderID: string
  let createdDate: string
  let lastModifiedDate: string
  let dynamodb: DynamoDB = new DynamoDB()

  it("Remove table if any", async () => {
    try {
      await dynamodb.dbTableDelete(INTEGRATION_TEST_TABLE_NAME)
      await waitUntilTableNotExists(
        {
          client: dynamodb.dynamo,
          ...INTEGRATION_TEST_DB_DELAY,
        },
        INTEGRATION_TEST_TABLE_NAME
      )
    } catch (error) {
      logger.info(`  NOT FOUND integration table: ${INTEGRATION_TEST_TABLE_NAME.TableName}`)
    }
  }, 15000)

  it("Create table", async () => {
    await dynamodb.dbTableCreate({
      ...INTEGRATION_TEST_TABLE_NAME,
      ...tableData,
    })
    // wait until table create
    await waitUntilTableExists(
      {
        client: dynamodb.dynamo,
        ...INTEGRATION_TEST_DB_DELAY,
      },
      INTEGRATION_TEST_TABLE_NAME
    )
  }, 15000)

  test("List all clients before add", async () => {
    const output = await clientHandler({
      ...commonProps,
      path: "/client",
    })
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients.items
    expect(clients.length).toEqual(0)
  })

  test("Add a client", async () => {
    // Date variables for later comparison
    createdDate = new Date().toISOString()
    lastModifiedDate = createdDate
    const output = await clientHandler({
      ...commonProps,
      httpMethod: "POST",
      path: "/client",
      body: { ...data.client.testUser },
    })
    expect(output.statusCode).toBe(200)
    const item = JSON.parse(output.body).clients.items[0]
    expect(item.PK).toBe(CLIENT_PK)
    expect(item.id.length).toBeGreaterThan(0)
    id = item.id
  })

  test("Get added reminder back, it should have reference", async () => {
    const output = await reminderHandler({
      ...commonProps,
      path: "/reminder",
    })
    expect(output.statusCode).toBe(200)
    const reminder = JSON.parse(output.body).reminders.items[0]
    expect(reminder.reference).not.toBeUndefined()
    expect(reminder.reference.PK).toBe(CLIENT_PK)
    expect(reminder.reference.id).toBe(id)
  })

  test("List all clients after add", async () => {
    const output = await clientHandler({
      ...commonProps,
      path: "/client",
    })
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients.items
    expect(clients.length).toEqual(1)
    id = clients[0].id
    reminderID = clients[0].reminder.id
  })

  test("Get a client", async () => {
    const output = await clientHandler({
      ...commonProps,
      path: "/client/:id",
      pathParameters: {
        id,
      },
    })
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients.items
    expect(clients.length).toEqual(1)
    expect(clients[0].name).toEqual("Test User")
    createdDate = clients[0].createdDate
  })

  test("Search a client", async () => {
    const output = await clientHandler({
      ...commonProps,
      path: "/client/search",
      queryStringParameters: {
        keyword: "Test",
        scope: "all",
      },
    })
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients.items
    expect(clients.length).toEqual(1)
    expect(clients[0].name).toEqual("Test User")
  })

  test("Filter a client", async () => {
    const output = await clientHandler({
      ...commonProps,
      path: "/client",
      // filter client Male
      queryStringParameters: {
        param: "eyJmaWx0ZXIiOnsiZ2VuZGVyIjoiTWFsZSJ9fQ==",
      },
    })
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients.items
    expect(clients.length).toEqual(1)
    expect(clients[0].name).toEqual("Test User")
  })

  test("Update a client", async () => {
    lastModifiedDate = new Date().toISOString()
    const output = await clientHandler({
      ...commonProps,
      httpMethod: "PUT",
      path: "/client/:id",
      pathParameters: {
        id,
      },
      body: {
        ...data.client.modifiedUser,
        reminder: {
          id: reminderID,
          PK: REMINDER_PK,
          ...data.client.modifiedUser.reminder,
        },
        createdDate,
      },
    })
    expect(output.statusCode).toBe(200)
  })

  test("Get updated reminder back, only name should change.", async () => {
    const output = await reminderHandler({
      ...commonProps,
      path: "/reminder",
    })
    expect(output.statusCode).toBe(200)
    const reminder = JSON.parse(output.body).reminders.items[0]
    expect(reminder.name).toBe("Modified Test Reminder")
  })

  test("Get a client after update", async () => {
    const output = await clientHandler({
      ...commonProps,
      pathParameters: {
        id,
      },
      path: "/client/:id",
    })
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients.items
    expect(clients.length).toEqual(1)
    expect(clients[0].name).toEqual("Modified User")
  })

  test("Delete a client", async () => {
    const output = await clientHandler({
      ...commonProps,
      pathParameters: {
        id,
      },
      httpMethod: "DELETE",
      path: "/client/:id",
    })
    expect(output.statusCode).toBe(200)
  })

  test("Reminder should be deleted along with client deletion", async () => {
    const output = await reminderHandler({
      ...commonProps,
      path: "/reminder",
    })
    expect(output.statusCode).toBe(200)
    const reminder = JSON.parse(output.body).reminders
    expect(reminder.items.length).toEqual(0)
  })

  test("List all clients after delete", async () => {
    const output = await clientHandler({
      ...commonProps,
      path: "/client",
    })
    expect(output.statusCode).toBe(200)
    const clients = JSON.parse(output.body).clients.items
    expect(clients.length).toEqual(0)
  })

  test("Add a template", async () => {
    // Date variables for later comparison
    createdDate = new Date().toISOString()
    lastModifiedDate = new Date().toISOString()
    const output = await templateHandler({
      ...commonProps,
      httpMethod: "POST",
      path: "/template",
      body: {
        name: "Email Template",
        subject: "Test Email",
        template: "<h1>This is an email template.</h1>",
        createdBy: "Ryan",
      },
    })
    expect(output.statusCode).toBe(200)
    const item = JSON.parse(output.body).templates.items[0]
    expect(item.PK).toBe(TEMPLATE_PK)
    expect(item.id.length).toBeGreaterThan(0)
    id = item.id
  })

  test("Update a template", async () => {
    const output = await templateHandler({
      ...commonProps,
      httpMethod: "PUT",
      path: "/template/:id",
      pathParameters: {
        id,
      },
      body: {
        name: "Modified Template",
        subject: "New Test Email",
        template: "<h2>This is an email template.</h2>",
        createdBy: "Ryan",
      },
    })
    expect(output.statusCode).toBe(200)
  })

  test("Get a template", async () => {
    const output = await templateHandler({
      ...commonProps,
      path: "/template/:id",
      pathParameters: {
        id,
      },
    })
    expect(output.statusCode).toBe(200)
    const template = JSON.parse(output.body).templates.items
    expect(template.length).toEqual(1)
    expect(template[0].name).toEqual("Modified Template")
  })

  test("List templates", async () => {
    const output = await templateHandler({
      ...commonProps,
      path: "/template",
    })
    expect(output.statusCode).toBe(200)
    const template = JSON.parse(output.body).templates.items
    expect(template[0].name).toEqual("Modified Template")
  })

  test("Delete a template", async () => {
    const output = await templateHandler({
      ...commonProps,
      httpMethod: "DELETE",
      path: "/template/:id",
      pathParameters: {
        id,
      },
    })
    expect(output.statusCode).toBe(200)
  })

  it("Remove test table", async () => {
    await dynamodb.dbTableDelete(INTEGRATION_TEST_TABLE_NAME)
  }, 15000)
})
*/
