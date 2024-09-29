import { addPropertyBodySchema } from "../../Backend/src/lambdas/service/property/property-types";
import {
  addFilesBodySchema,
  fileSchema,
} from "../../Backend/src/lambdas/service/file/file-types";
import { addClientBodySchema } from "../../Backend/src/lambdas/service/client/client-types";
import { emailServiceBodySchema } from "../../Backend/src/lambdas/service/marketing/email-types";
import { addTemplateBodySchema } from "../../Backend/src/lambdas/service/template/template-types";
import { addSettingBodySchema } from "../../Backend/src/lambdas/service/settings/settings-types";
import { addReminderBodySchema } from "../../Backend/src/lambdas/service/reminder/reminder-types";
import {addAgentSchema} from "../../Backend/src/lambdas/service/agent/agent-types"

const uuid = {
  name: "id",
  in: "path",
  description: "by uuid",
  required: true,
  schema: {
    type: "string",
  },
};

const name = {
  name: "name",
  in: "path",
  description: "by name",
  required: true,
  schema: {
    type: "string",
  },
};

export const swaggerDocs = {
  openapi: "3.0.3",
  info: {
    title: "Cyberlark API",
    description: "",
    version: "0.0.1",
  },
  servers: [
    {
      description: "jr",
      url: `https://<api-endpoint>`,
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Client",
      description: "Client APIs",
    },
    {
      name: "Agent",
      description: "Agent APIs",
    },
    {
      name: "Property",
      description: "Property APIs",
    },
    {
      name: "File",
      description: "File APIs",
    },
    {
      name: "Template",
      description: "Email Template APIs",
    },
    {
      name: "Marketing",
      description: "Marketing APIs",
    },
    {
      name: "Reminder",
      description: "Reminder APIs",
    },
    {
      name: "Settings",
      description: "Settings APIs",
    },
    {
      name: "Profile",
      description: "Profile APIs",
    },
    {
      name: "Version",
      description: "API version",
    },
  ],
  paths: {
    ///////////////////////////////////////////////////////////////////////////
    // CLIENT
    "/client": {
      post: {
        tags: ["Client"],
        summary: "Add a new client",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addClient" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      get: {
        tags: ["Client"],
        summary: "List clients - NEED REWORK ON API - DO NOT USE -",
        parameters: [
          {
            name: "param",
            description:
              "List parameters, such as filter or next page. The param string is encoded",
            in: "query",
            required: false,
            explode: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/client/count": {
      get: {
        tags: ["Client"],
        summary: "Get the total number of clients",
        responses: {
          "200": { description: "Successful operation" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/client/{id}": {
      get: {
        tags: ["Client"],
        summary: "Find client details by ID",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        tags: ["Client"],
        summary: "Update an existing client",
        parameters: [uuid],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addClient" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        tags: ["Client"],
        summary: "Delete client",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful or failed" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    ///////////////////////////////////////////////////////////////////////////
    // PROPERTY
    "/property": {
      post: {
        tags: ["Property"],
        summary: "Add a new property",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addProperty" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      get: {
        tags: ["Property"],
        summary: "List properties",
        parameters: [
          {
            name: "param",
            description:
              "List parameters, such as filter or next page. The param string is encoded",
            in: "query",
            required: false,
            explode: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/property/count": {
      get: {
        tags: ["Property"],
        summary: "Get the total number of properties",
        responses: {
          "200": { description: "Successful operation" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/property/{id}": {
      get: {
        tags: ["Property"],
        summary: "Find property details by ID",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        tags: ["Property"],
        summary: "Update an existing property",
        parameters: [uuid],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addProperty" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        tags: ["Property"],
        summary: "Delete property",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful or failed" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    ///////////////////////////////////////////////////////////////////////////
    // FILE
    "/file": {
      post: {
        tags: ["File"],
        summary: "Add new files",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addFile" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        tags: ["File"],
        summary: "Delete file(s) by id",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: uuid,
                example: ["uuid1", "uuid2"],
              },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/file/{id}": {
      get: {
        tags: ["File"],
        summary: "Get file by id",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        tags: ["File"],
        summary: "Update an existing file",
        parameters: [uuid],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/updateFile" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/file/upload": {
      get: {
        tags: ["File"],
        summary: "Get pre-signed url for file upload",
        parameters: [
          {
            name: "numOfUrlRequests",
            in: "query",
            description: "Number of URLs needed",
            required: true,
            schema: {
              type: "number",
            },
          },
        ],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },

    ///////////////////////////////////////////////////////////////////////////
    // PROFILE  /profile
    "/profile": {
      post: {
        tags: ["Profile"],
        summary: "Check if email has profile",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                  },
                },
                required: ["email"],
              },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "401": { description: "Unauthorized" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    ///////////////////////////////////////////////////////////////////////////
    // MARKETING  /marketing
    "/marketing": {
      post: {
        tags: ["Marketing"],
        summary: "Send marketing emails",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/marketing" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    ///////////////////////////////////////////////////////////////////////////
    // TEMPLATE  /template
    "/template": {
      post: {
        tags: ["Template"],
        summary: "Add a new template",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addTemplate" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      get: {
        tags: ["Template"],
        summary: "List templates - NEED REWORK ON API - DO NOT USE -",
        parameters: [
          {
            name: "param",
            description:
              "List parameters, such as filter or next page. The param string is encoded",
            in: "query",
            required: false,
            explode: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/template/count": {
      get: {
        tags: ["Template"],
        summary: "Get the total number of templates",
        responses: {
          "200": { description: "Successful operation" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/template/{id}": {
      get: {
        tags: ["Template"],
        summary: "Find template details by ID",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        tags: ["Template"],
        summary: "Update an existing template",
        parameters: [uuid],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addTemplate" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        tags: ["Template"],
        summary: "Delete template",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful or failed" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },

    ///////////////////////////////////////////////////////////////////////////
    // SETTINGS  /settings
    "/settings": {
      post: {
        tags: ["Settings"],
        summary: "Add a new setting",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addSettings" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      get: {
        tags: ["Settings"],
        summary: "List all settings",
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/settings/{name}": {
      get: {
        tags: ["Settings"],
        summary: "Find settings details by name",
        parameters: [name],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        tags: ["Settings"],
        summary: "Update an existing setting",
        parameters: [name],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addSettings" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        tags: ["Settings"],
        summary: "Delete the setting by name",
        parameters: [name],
        responses: {
          "200": { description: "Successful or failed" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },

    ///////////////////////////////////////////////////////////////////////////
    // REMINDER  /reminder
    "/reminder": {
      post: {
        tags: ["Reminder"],
        summary: "Add a new reminder",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addReminder" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      get: {
        tags: ["Reminder"],
        summary: "List all reminder",
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    "/reminder/{id}": {
      get: {
        tags: ["Reminder"],
        summary: "Find reminder details by uuid",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        tags: ["Reminder"],
        summary: "Update an existing reminder",
        parameters: [uuid],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addReminder" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Successful operation" },
          "400": { description: "Bad request" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        tags: ["Reminder"],
        summary: "Delete the reminder by uuid",
        parameters: [uuid],
        responses: {
          "200": { description: "Successful or failed" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },

    ///////////////////////////////////////////////////////////////////////////
    // VERSION  /version
    "/version": {
      get: {
        tags: ["Version"],
        summary: "Show API version",
        responses: {
          "200": { description: "Successful operation" },
          "500": { description: "Unexpected server error" },
        },
        security: [{ bearerAuth: [] }],
      },
    },

     ///////////////////////////////////////////////////////////////////////////
    // AGENT
    "/agent": {
      post: {
        tags: ["Agent"],
        summary: "Add a new agent",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/addAgent" },
            },
          },
          required: true,
        },
        responses: {
          "200": { description: "Agent added successfully" },
          "400": { description: "username is require" },
          "500": { description: "Unexpected server error" },
          "201":{description: "User account already exists at this UserPool"}
        },
        security: [{ bearerAuth: [] }],
      },
    }
  },
  components: {
    schemas: {
      addProperty: addPropertyBodySchema,
      addFile: addFilesBodySchema,
      updateFile: fileSchema,
      addClient: addClientBodySchema,
      marketing: emailServiceBodySchema,
      addTemplate: addTemplateBodySchema,
      addSettings: addSettingBodySchema,
      addReminder: addReminderBodySchema,
      addAgent: addAgentSchema
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Bearer token",
      },
    },
  },
};
