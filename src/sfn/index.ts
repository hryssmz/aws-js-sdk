// sfn/index.ts
import {
  GetActivityTaskCommand,
  SendTaskSuccessCommand,
  SFNClient,
} from "@aws-sdk/client-sfn";
import { defaultClientConfig } from "../utils";
import type {
  GetActivityTaskCommandInput,
  SendTaskSuccessCommandInput,
  SFNClientConfig,
} from "@aws-sdk/client-sfn";

export const defaultSFNClientConfig = {
  ...defaultClientConfig,
};

export class SFNWrapper {
  client: SFNClient;

  constructor(config?: SFNClientConfig) {
    this.client = new SFNClient({ ...defaultSFNClientConfig, ...config });
  }

  async getActivityTask(params: GetActivityTaskCommandInput) {
    const command = new GetActivityTaskCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async sendTaskSuccess(params: SendTaskSuccessCommandInput) {
    const command = new SendTaskSuccessCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
