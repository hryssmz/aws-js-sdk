// dynamodb/index.ts
import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  GetItemCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommand,
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { defaultClientConfig } from "../utils";
import type {
  CreateTableCommandInput,
  DeleteTableCommandInput,
  DescribeTableCommandInput,
  DynamoDBClientConfig,
  GetItemCommandInput,
  ListTablesCommandInput,
} from "@aws-sdk/client-dynamodb";
import type {
  BatchGetCommandInput,
  BatchWriteCommandInput,
  DeleteCommandInput,
  GetCommandInput,
  PutCommandInput,
  QueryCommandInput,
  ScanCommandInput,
  TranslateConfig,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

export const defaultDynamoDBClientConfig: DynamoDBClientConfig = {
  ...defaultClientConfig,
};

export const defaultTranslateConfig: TranslateConfig = {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: false,
    convertClassInstanceToMap: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
};

export class DynamoDBWrapper {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  constructor(
    config?: DynamoDBClientConfig,
    translateConfig?: TranslateConfig
  ) {
    this.client = new DynamoDBClient({
      ...defaultDynamoDBClientConfig,
      ...config,
    });
    this.docClient = DynamoDBDocumentClient.from(this.client, {
      ...defaultDynamoDBClientConfig,
      ...translateConfig,
    });
  }

  async batchGet(params: BatchGetCommandInput) {
    const command = new BatchGetCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }

  async batchWrite(params: BatchWriteCommandInput) {
    const command = new BatchWriteCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }

  async createTable(params: CreateTableCommandInput) {
    const command = new CreateTableCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async delete(params: DeleteCommandInput) {
    const command = new DeleteCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }

  async deleteTable(params: DeleteTableCommandInput) {
    const command = new DeleteTableCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async describeTable(params: DescribeTableCommandInput) {
    const command = new DescribeTableCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async get(params: GetCommandInput) {
    const command = new GetCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }

  async getItem(params: GetItemCommandInput) {
    const command = new GetItemCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listTables(params: ListTablesCommandInput) {
    const command = new ListTablesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async put(params: PutCommandInput) {
    const command = new PutCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }

  async query(params: QueryCommandInput) {
    const command = new QueryCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }

  async scan(params: ScanCommandInput) {
    const command = new ScanCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }

  async update(params: UpdateCommandInput) {
    const command = new UpdateCommand(params);
    const result = await this.docClient.send(command);
    return result;
  }
}
