// apigateway/legacy.ts
import {
  APIGatewayClient,
  CreateResourceCommand,
  CreateRestApiCommand,
  DeleteMethodCommand,
  DeleteResourceCommand,
  DeleteRestApiCommand,
  GetMethodCommand,
  GetResourceCommand,
  GetResourcesCommand,
  GetRestApiCommand,
  GetRestApisCommand,
  PutMethodCommand,
} from "@aws-sdk/client-api-gateway";
import { defaultAPIGatewayClientConfig } from "./wrapper";
import { sleep } from "../utils";
import type {
  APIGatewayClientConfig,
  CreateResourceCommandInput,
  CreateRestApiCommandInput,
  CreateRestApiCommandOutput,
  DeleteMethodCommandInput,
  DeleteResourceCommandInput,
  DeleteRestApiCommandInput,
  DeleteRestApiCommandOutput,
  GetMethodCommandInput,
  GetResourceCommandInput,
  GetResourcesCommandInput,
  GetRestApiCommandInput,
  GetRestApisCommandInput,
  PutMethodCommandInput,
} from "@aws-sdk/client-api-gateway";

export const createAPIGatewayClient = (config?: APIGatewayClientConfig) => {
  return new APIGatewayClient({ ...defaultAPIGatewayClientConfig, ...config });
};

export const createResource = async (
  params: CreateResourceCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new CreateResourceCommand(params);
  const result = await client.send(command);
  return result;
};

export const createRestApi = async (
  params: CreateRestApiCommandInput,
  client = createAPIGatewayClient()
): Promise<CreateRestApiCommandOutput> => {
  const command = new CreateRestApiCommand(params);
  const result = await client.send(command).catch(async (error: Error) => {
    /* c8 ignore next 7 */
    if (error.name === "TooManyRequestsException") {
      await sleep(3);
      const result = await createRestApi(params, client);
      return result;
    } else {
      throw error;
    }
  });
  return result;
};

export const deleteMethod = async (
  params: DeleteMethodCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new DeleteMethodCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteResource = async (
  params: DeleteResourceCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new DeleteResourceCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRestApi = async (
  params: DeleteRestApiCommandInput,
  client = createAPIGatewayClient()
): Promise<DeleteRestApiCommandOutput> => {
  const command = new DeleteRestApiCommand(params);
  const result = await client.send(command).catch(async (error: Error) => {
    /* c8 ignore next 7 */
    if (error.name === "TooManyRequestsException") {
      await sleep(30);
      const result = await deleteRestApi(params, client);
      return result;
    } else {
      throw error;
    }
  });
  return result;
};

export const getMethod = async (
  params: GetMethodCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new GetMethodCommand(params);
  const result = await client.send(command);
  return result;
};

export const getResource = async (
  params: GetResourceCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new GetResourceCommand(params);
  const result = await client.send(command);
  return result;
};

export const getResources = async (
  params: GetResourcesCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new GetResourcesCommand(params);
  const result = await client.send(command);
  return result;
};

export const getRestApi = async (
  params: GetRestApiCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new GetRestApiCommand(params);
  const result = await client.send(command);
  return result;
};

export const getRestApis = async (
  params: GetRestApisCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new GetRestApisCommand(params);
  const result = await client.send(command);
  return result;
};

export const putMethod = async (
  params: PutMethodCommandInput,
  client = createAPIGatewayClient()
) => {
  const command = new PutMethodCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAllMethods = async (
  restApiId?: string,
  resourceId?: string,
  client = createAPIGatewayClient()
) => {
  const { resourceMethods } = await getResource(
    { restApiId, resourceId },
    client
  );
  /* c8 ignore next */
  const promises = Object.keys(resourceMethods ?? {}).map(async httpMethod => {
    const result = await deleteMethod(
      { restApiId, resourceId, httpMethod },
      client
    );
    return result;
  });
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllResources = async (
  restApiId?: string,
  client = createAPIGatewayClient()
) => {
  const { items } = await getResources({ restApiId }, client);
  const promises =
    items
      ?.filter(({ path }) => path !== "/")
      .map(async ({ id }) => {
        const result = await deleteResource(
          { resourceId: id, restApiId },
          client
        );
        return result;
        /* c8 ignore next */
      }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteRestApisByPrefix = async (
  prefix: string,
  client = createAPIGatewayClient()
) => {
  const { items } = await getRestApis({}, client);
  const promises =
    items
      ?.filter(({ name }) => name?.startsWith(prefix))
      .map(async ({ id }) => {
        const result = await deleteRestApi({ restApiId: id }, client);
        return result;
        /* c8 ignore next */
      }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const getResourceByPath = async (
  path: string,
  restApiId?: string,
  client = createAPIGatewayClient()
) => {
  const { items } = await getResources({ restApiId }, client);
  const result = items?.find(item => item.path === path);
  if (result === undefined) {
    throw new Error(`Resource path not found: ${path}`);
  }
  return result;
};

export const getRestApiByName = async (
  name: string,
  client = createAPIGatewayClient()
) => {
  const { items } = await getRestApis({}, client);
  const result = items?.find(item => item.name === name);
  if (result === undefined) {
    throw new Error(`REST API not found: ${name}`);
  }
  return result;
};
