// sqs/index.ts
import {
  GetRecordsCommand,
  GetShardIteratorCommand,
  KinesisClient,
  PutRecordCommand,
  PutRecordsCommand,
} from "@aws-sdk/client-kinesis";
import { defaultClientConfig } from "../utils";
import type {
  GetRecordsCommandInput,
  GetShardIteratorCommandInput,
  KinesisClientConfig,
  PutRecordCommandInput,
  PutRecordsCommandInput,
} from "@aws-sdk/client-kinesis";

export const defaultKinesisClientConfig = {
  ...defaultClientConfig,
};

export class KinesisWrapper {
  client: KinesisClient;

  constructor(config?: KinesisClientConfig) {
    this.client = new KinesisClient({
      ...defaultKinesisClientConfig,
      ...config,
    });
  }

  async getRecords(params: GetRecordsCommandInput) {
    const command = new GetRecordsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getShardIterator(params: GetShardIteratorCommandInput) {
    const command = new GetShardIteratorCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putRecord(params: PutRecordCommandInput) {
    const command = new PutRecordCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putRecords(params: PutRecordsCommandInput) {
    const command = new PutRecordsCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
