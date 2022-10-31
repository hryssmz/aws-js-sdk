// cloudformation/index.ts
import {
  CloudFormationClient,
  CreateStackCommand,
  DeleteStackCommand,
  UpdateStackCommand,
} from "@aws-sdk/client-cloudformation";
import { defaultClientConfig } from "../utils";
import type {
  CloudFormationClientConfig,
  CreateStackCommandInput,
  DeleteStackCommandInput,
  UpdateStackCommandInput,
} from "@aws-sdk/client-cloudformation";

export const defaultCloudFormationClientConfig = {
  ...defaultClientConfig,
};

export class CloudFormationWrapper {
  client: CloudFormationClient;

  constructor(config?: CloudFormationClientConfig) {
    this.client = new CloudFormationClient({
      ...defaultCloudFormationClientConfig,
      ...config,
    });
  }

  async createStack(params: CreateStackCommandInput) {
    const command = new CreateStackCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteStack(params: DeleteStackCommandInput) {
    const command = new DeleteStackCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async updateStack(params: UpdateStackCommandInput) {
    const command = new UpdateStackCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
