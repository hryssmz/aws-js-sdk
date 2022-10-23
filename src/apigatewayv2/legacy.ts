// apigatewayv2/legacy.ts
import {
  ApiGatewayV2Client,
  CreateApiCommand,
  CreateRouteCommand,
  DeleteApiCommand,
  DeleteRouteCommand,
  GetApiCommand,
  GetApisCommand,
  GetRouteCommand,
  GetRoutesCommand,
} from "@aws-sdk/client-apigatewayv2";
import { defaultApiGatewayV2ClientConfig } from "./wrapper";
import type {
  ApiGatewayV2ClientConfig,
  CreateApiCommandInput,
  CreateRouteCommandInput,
  DeleteApiCommandInput,
  DeleteRouteCommandInput,
  GetApiCommandInput,
  GetApisCommandInput,
  GetRouteCommandInput,
  GetRoutesCommandInput,
} from "@aws-sdk/client-apigatewayv2";

export const createApiGatewayV2Client = (config?: ApiGatewayV2ClientConfig) => {
  return new ApiGatewayV2Client({
    ...defaultApiGatewayV2ClientConfig,
    ...config,
  });
};

export const createApi = async (
  params: CreateApiCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new CreateApiCommand(params);
  const result = await client.send(command);
  return result;
};

export const createRoute = async (
  params: CreateRouteCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new CreateRouteCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteApi = async (
  params: DeleteApiCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new DeleteApiCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRoute = async (
  params: DeleteRouteCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new DeleteRouteCommand(params);
  const result = await client.send(command);
  return result;
};

export const getApi = async (
  params: GetApiCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new GetApiCommand(params);
  const result = await client.send(command);
  return result;
};

export const getApis = async (
  params: GetApisCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new GetApisCommand(params);
  const result = await client.send(command);
  return result;
};

export const getRoute = async (
  params: GetRouteCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new GetRouteCommand(params);
  const result = await client.send(command);
  return result;
};

export const getRoutes = async (
  params: GetRoutesCommandInput,
  client = createApiGatewayV2Client()
) => {
  const command = new GetRoutesCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAllRoutes = async (
  ApiId?: string,
  client = createApiGatewayV2Client()
) => {
  const { Items } = await getRoutes({ ApiId }, client);
  const promises =
    Items?.map(async ({ RouteId }) => {
      await deleteRoute({ ApiId, RouteId }, client);
      /* c8 ignore next */
    }) ?? [];
  const results = Promise.all(promises);
  return results;
};

export const deleteApisByPrefix = async (
  prefix: string,
  client = createApiGatewayV2Client()
) => {
  const { Items } = await getApis({}, client);
  const promises =
    Items?.filter(({ Name }) => Name?.startsWith(prefix)).map(
      async ({ ApiId }) => {
        const result = await deleteApi({ ApiId }, client);
        return result;
      }
      /* c8 ignore next */
    ) ?? [];
  const results = Promise.all(promises);
  return results;
};

export const getApiByName = async (
  name: string,
  client = createApiGatewayV2Client()
) => {
  const { Items } = await getApis({}, client);
  const result = Items?.find(({ Name }) => Name === name);
  if (result === undefined) {
    throw new Error(`API not found: ${name}`);
  }
  return result;
};

export const getRouteByKey = async (
  key: string,
  ApiId?: string,
  client = createApiGatewayV2Client()
) => {
  const { Items } = await getRoutes({ ApiId }, client);
  const result = Items?.find(({ RouteKey }) => RouteKey === key);
  if (result === undefined) {
    throw new Error(`Route not found: ${key}`);
  }
  return result;
};
