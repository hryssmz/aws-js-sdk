// dynamodb/actions.ts
import { DynamoDBWrapper } from ".";
import type { Action } from "../utils";

const tableName = "Music";

async function createDynamoTable() {
  const dynamodb = new DynamoDBWrapper();
  await dynamodb.createTable({
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: "Artist", AttributeType: "S" },
      { AttributeName: "SongTitle", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "Artist", KeyType: "HASH" },
      { AttributeName: "SongTitle", KeyType: "RANGE" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    TableClass: "STANDARD",
  });
  return JSON.stringify(tableName, null, 2);
}

async function deleteDynamoItem() {
  const dynamodb = new DynamoDBWrapper();
  const { Attributes } = await dynamodb.delete({
    TableName: tableName,
    Key: {
      Artist: "No One You Know",
      SongTitle: "Call Me Today",
    },
  });
  return JSON.stringify(Attributes, null, 2);
}

async function deleteDynamoTable() {
  const dynamodb = new DynamoDBWrapper();
  await dynamodb.deleteTable({ TableName: tableName });
  return JSON.stringify(tableName, null, 2);
}

async function describeDynamoTable() {
  const dynamodb = new DynamoDBWrapper();
  const { Table } = await dynamodb.describeTable({ TableName: tableName });
  return JSON.stringify(Table, null, 2);
}

async function emptyDynamoTable() {
  const dynamodb = new DynamoDBWrapper();
  const { Items } = await dynamodb.scan({ TableName: tableName });
  const promises =
    Items?.map(({ Artist, SongTitle }) =>
      dynamodb.delete({ TableName: tableName, Key: { Artist, SongTitle } })
    ) ?? [];
  await Promise.all(promises);
  return JSON.stringify(Items?.length, null, 2);
}

async function getDynamoItem() {
  const dynamodb = new DynamoDBWrapper();
  const { Item } = await dynamodb.get({
    TableName: tableName,
    Key: {
      Artist: "No One You Know",
      SongTitle: "Call Me Today",
    },
  });
  return JSON.stringify(Item, null, 2);
}

async function getDynamoItems() {
  const dynamodb = new DynamoDBWrapper();
  const Keys = [
    { Artist: "No One You Know", SongTitle: "Howdy" },
    { Artist: "Acme Band", SongTitle: "Happy Day" },
    { Artist: "Acme Band", SongTitle: "PartiQL Rocks" },
  ];
  const { Responses } = await dynamodb.batchGet({
    RequestItems: { [tableName]: { Keys } },
  });
  return JSON.stringify(Responses?.[tableName], null, 2);
}

async function listTables() {
  const dynamodb = new DynamoDBWrapper();
  const { TableNames } = await dynamodb.listTables({});
  return JSON.stringify(TableNames, null, 2);
}

async function putDynamoItem() {
  const dynamodb = new DynamoDBWrapper();
  const Item = {
    Artist: "No One You Know",
    SongTitle: "Call Me Today",
    AlbumTitle: "Somewhat Famous",
    Awards: "1",
  };
  await dynamodb.put({ TableName: tableName, Item });
  return JSON.stringify(Item, null, 2);
}

async function putDynamoItems() {
  const dynamodb = new DynamoDBWrapper();
  const items = [
    {
      Artist: "No One You Know",
      SongTitle: "Howdy",
      AlbumTitle: "Somewhat Famous",
      Awards: "2",
    },
    {
      Artist: "Acme Band",
      SongTitle: "Happy Day",
      AlbumTitle: "Songs About Life",
      Awards: "10",
    },
    {
      Artist: "Acme Band",
      SongTitle: "PartiQL Rocks",
      AlbumTitle: "Another Album Title",
      Awards: "8",
    },
  ];
  await dynamodb.batchWrite({
    RequestItems: {
      [tableName]: items.map(Item => ({ PutRequest: { Item } })),
    },
  });
  return JSON.stringify(items, null, 2);
}

async function queryDynamoTable() {
  const dynamodb = new DynamoDBWrapper();
  const { Items } = await dynamodb.query({
    TableName: tableName,
    KeyConditionExpression: "Artist = :name",
    ExpressionAttributeValues: {
      ":name": "Acme Band",
    },
  });
  return JSON.stringify(Items, null, 2);
}

async function scanDynamoTable() {
  const dynamodb = new DynamoDBWrapper();
  const { Items } = await dynamodb.scan({
    TableName: tableName,
  });
  return JSON.stringify(Items, null, 2);
}

async function updateDynamoItem() {
  const dynamodb = new DynamoDBWrapper();
  const { Attributes } = await dynamodb.update({
    TableName: tableName,
    Key: {
      Artist: "Acme Band",
      SongTitle: "Happy Day",
    },
    UpdateExpression: "SET AlbumTitle = :newval",
    ExpressionAttributeValues: { ":newval": "Updated Album Title" },
    ReturnValues: "ALL_NEW",
  });
  return JSON.stringify(Attributes, null, 2);
}

const actions: Record<string, Action> = {
  createDynamoTable,
  deleteDynamoItem,
  deleteDynamoTable,
  describeDynamoTable,
  emptyDynamoTable,
  getDynamoItem,
  getDynamoItems,
  listTables,
  putDynamoItem,
  putDynamoItems,
  queryDynamoTable,
  scanDynamoTable,
  updateDynamoItem,
};

export default actions;
