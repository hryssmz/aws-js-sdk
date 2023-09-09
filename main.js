const { randomUUID } = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = async () => {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient());
  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { Id: randomUUID() },
  });
  const { Attributes } = await client.send(command);
  return Attributes;
};
