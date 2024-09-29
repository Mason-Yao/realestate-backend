module.exports = {
  tables: [
    {
      TableName: "CRM",
      KeySchema: [
        { AttributeName: "PK", KeyType: "HASH" },
        { AttributeName: "id", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "name", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
        { AttributeName: "phone", AttributeType: "S" },
        { AttributeName: "lastModifiedDate", AttributeType: "S" },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      LocalSecondaryIndexes: [
        {
          IndexName: "name-index",
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "name", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "email-index",
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "email", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "phone-index",
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "phone", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "modified-date-index",
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "lastModifiedDate", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
      ],
    },
  ],
}
