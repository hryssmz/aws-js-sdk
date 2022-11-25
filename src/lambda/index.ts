// lambda/index.ts
import {
  AddPermissionCommand,
  CreateFunctionCommand,
  DeleteFunctionCommand,
  GetFunctionCommand,
  InvokeCommand,
  LambdaClient,
  ListFunctionsCommand,
  PublishLayerVersionCommand,
  RemovePermissionCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";
import { defaultClientConfig } from "../utils";
import type {
  AddPermissionCommandInput,
  CreateFunctionCommandInput,
  DeleteFunctionCommandInput,
  GetFunctionCommandInput,
  InvokeCommandInput,
  LambdaClientConfig,
  ListFunctionsCommandInput,
  PublishLayerVersionCommandInput,
  RemovePermissionCommandInput,
  UpdateFunctionCodeCommandInput,
  UpdateFunctionConfigurationCommandInput,
} from "@aws-sdk/client-lambda";

export const defaultLambdaClientConfig = {
  ...defaultClientConfig,
};

export class LambdaWrapper {
  client: LambdaClient;

  constructor(config?: LambdaClientConfig) {
    this.client = new LambdaClient({ ...defaultLambdaClientConfig, ...config });
  }

  async addPermission(params: AddPermissionCommandInput) {
    const command = new AddPermissionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createFunction(params: CreateFunctionCommandInput) {
    const command = new CreateFunctionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteFunction(params: DeleteFunctionCommandInput) {
    const command = new DeleteFunctionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getFunction(params: GetFunctionCommandInput) {
    const command = new GetFunctionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async invoke(params: InvokeCommandInput) {
    const command = new InvokeCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listFunctions(params: ListFunctionsCommandInput) {
    const command = new ListFunctionsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async publishLayerVersion(params: PublishLayerVersionCommandInput) {
    const command = new PublishLayerVersionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async removePermission(params: RemovePermissionCommandInput) {
    const command = new RemovePermissionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async updateFunctionCode(params: UpdateFunctionCodeCommandInput) {
    const command = new UpdateFunctionCodeCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async updateFunctionConfiguration(
    params: UpdateFunctionConfigurationCommandInput
  ) {
    const command = new UpdateFunctionConfigurationCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
