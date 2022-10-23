// lambda/wrapper.ts
import {
  CreateFunctionCommand,
  DeleteFunctionCommand,
  GetFunctionCommand,
  InvokeCommand,
  LambdaClient,
  ListFunctionsCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";
import { defaultClientConfig } from "../utils";
import type {
  CreateFunctionCommandInput,
  DeleteFunctionCommandInput,
  GetFunctionCommandInput,
  InvokeCommandInput,
  LambdaClientConfig,
  ListFunctionsCommandInput,
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

  async deleteFunctionsByPrefix(prefix: string) {
    const { Functions } = await this.listFunctions({});
    const promises =
      Functions?.filter(({ FunctionName }) =>
        FunctionName?.startsWith(prefix)
      ).map(async ({ FunctionName }) => {
        const result = await this.deleteFunction({ FunctionName });
        return result;
        /* c8 ignore next */
      }) ?? [];
    const results = await Promise.all(promises);
    return results;
  }
}