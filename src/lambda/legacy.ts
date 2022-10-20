// lambda/legacy.ts
import {
  Architecture,
  CreateFunctionCommand,
  DeleteFunctionCommand,
  GetFunctionCommand,
  InvokeCommand,
  LambdaClient,
  ListFunctionsCommand,
  LogType,
  PackageType,
  Runtime,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";
import { defaultLambdaClientConfig } from "./wrapper";
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

export const createLambdaClient = (config?: LambdaClientConfig) => {
  return new LambdaClient({ ...defaultLambdaClientConfig, ...config });
};

export const createFunction = async (
  params: CreateFunctionCommandInput,
  client = createLambdaClient()
) => {
  const command = new CreateFunctionCommand({
    Architectures: [Architecture.arm64],
    Handler: "index.handler",
    PackageType: PackageType.Zip,
    Runtime: Runtime.nodejs16x,
    ...params,
  });
  const result = await client.send(command);
  return result;
};

export const deleteFunction = async (
  params: DeleteFunctionCommandInput,
  client = createLambdaClient()
) => {
  const command = new DeleteFunctionCommand(params);
  const result = await client.send(command);
  return result;
};

export const getFunction = async (
  params: GetFunctionCommandInput,
  client = createLambdaClient()
) => {
  const command = new GetFunctionCommand(params);
  const result = await client.send(command);
  return result;
};

export const invoke = async (
  params: InvokeCommandInput,
  client = createLambdaClient()
) => {
  const command = new InvokeCommand({
    LogType: LogType.Tail,
    ...params,
  });
  const result = await client.send(command);
  return result;
};

export const listFunctions = async (
  params: ListFunctionsCommandInput,
  client = createLambdaClient()
) => {
  const command = new ListFunctionsCommand(params);
  const result = await client.send(command);
  return result;
};

export const updateFunctionCode = async (
  params: UpdateFunctionCodeCommandInput,
  client = createLambdaClient()
) => {
  const command = new UpdateFunctionCodeCommand(params);
  const result = await client.send(command);
  return result;
};

export const updateFunctionConfiguration = async (
  params: UpdateFunctionConfigurationCommandInput,
  client = createLambdaClient()
) => {
  const command = new UpdateFunctionConfigurationCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteFunctionsByPrefix = async (
  prefix: string,
  client = createLambdaClient()
) => {
  const { Functions } = await listFunctions({}, client);
  const promises =
    Functions?.filter(({ FunctionName }) =>
      FunctionName?.startsWith(prefix)
    ).map(async ({ FunctionName }) => {
      const result = await deleteFunction({ FunctionName }, client);
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};
