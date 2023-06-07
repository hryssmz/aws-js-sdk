// cloudformation/index.ts
import {
  CloudFormationClient,
  CreateStackCommand,
  CreateStackSetCommand,
  DeleteStackCommand,
  DeleteStackSetCommand,
  DescribeStacksCommand,
  UpdateStackCommand,
  UpdateStackSetCommand,
  ValidateTemplateCommand,
} from "@aws-sdk/client-cloudformation";
import { defaultClientConfig } from "../utils";
import type {
  CloudFormationClientConfig,
  CreateStackCommandInput,
  CreateStackSetCommandInput,
  DeleteStackCommandInput,
  DeleteStackSetCommandInput,
  DescribeStacksCommandInput,
  UpdateStackCommandInput,
  UpdateStackSetCommandInput,
  ValidateTemplateCommandInput,
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

  async createStackSet(params: CreateStackSetCommandInput) {
    const command = new CreateStackSetCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteStack(params: DeleteStackCommandInput) {
    const command = new DeleteStackCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteStackSet(params: DeleteStackSetCommandInput) {
    const command = new DeleteStackSetCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async describeStacks(params: DescribeStacksCommandInput) {
    const command = new DescribeStacksCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async updateStack(params: UpdateStackCommandInput) {
    const command = new UpdateStackCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async updateStackSet(params: UpdateStackSetCommandInput) {
    const command = new UpdateStackSetCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async validateTemplate(params: ValidateTemplateCommandInput) {
    const command = new ValidateTemplateCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
