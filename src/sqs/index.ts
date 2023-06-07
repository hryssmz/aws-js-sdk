// sqs/index.ts
import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { defaultClientConfig } from "../utils";
import type {
  DeleteMessageCommandInput,
  GetQueueUrlCommandInput,
  PurgeQueueCommandInput,
  ReceiveMessageCommandInput,
  SendMessageCommandInput,
  SQSClientConfig,
} from "@aws-sdk/client-sqs";

export const defaultSQSClientConfig = {
  ...defaultClientConfig,
};

export class SQSWrapper {
  client: SQSClient;

  constructor(config?: SQSClientConfig) {
    this.client = new SQSClient({ ...defaultSQSClientConfig, ...config });
  }

  async deleteMessage(params: DeleteMessageCommandInput) {
    const command = new DeleteMessageCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getQueueUrl(params: GetQueueUrlCommandInput) {
    const command = new GetQueueUrlCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async purgeQueue(params: PurgeQueueCommandInput) {
    const command = new PurgeQueueCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async receiveMessage(params: ReceiveMessageCommandInput) {
    const command = new ReceiveMessageCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async sendMessage(params: SendMessageCommandInput) {
    const command = new SendMessageCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
