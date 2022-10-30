// apigatewayv2/wrapper.ts
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
import { defaultClientConfig } from "../utils";
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

export const defaultApiGatewayV2ClientConfig = {
  ...defaultClientConfig,
};

export class ApiGatewayV2Wrapper {
  client: ApiGatewayV2Client;

  constructor(config?: ApiGatewayV2ClientConfig) {
    this.client = new ApiGatewayV2Client({
      ...defaultApiGatewayV2ClientConfig,
      ...config,
    });
  }

  async createApi(params: CreateApiCommandInput) {
    const command = new CreateApiCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createRoute(params: CreateRouteCommandInput) {
    const command = new CreateRouteCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteApi(params: DeleteApiCommandInput) {
    const command = new DeleteApiCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteRoute(params: DeleteRouteCommandInput) {
    const command = new DeleteRouteCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getApi(params: GetApiCommandInput) {
    const command = new GetApiCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getApis(params: GetApisCommandInput) {
    const command = new GetApisCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getRoute(params: GetRouteCommandInput) {
    const command = new GetRouteCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getRoutes(params: GetRoutesCommandInput) {
    const command = new GetRoutesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getApiByName(name: string) {
    const { Items } = await this.getApis({});
    const result = Items?.find(({ Name }) => Name === name);
    if (result === undefined) {
      throw new Error(`API not found: ${name}`);
    }
    return result;
  }

  async getRouteByKey(key: string, ApiId?: string) {
    const { Items } = await this.getRoutes({ ApiId });
    const result = Items?.find(({ RouteKey }) => RouteKey === key);
    if (result === undefined) {
      throw new Error(`Route not found: ${key}`);
    }
    return result;
  }
}
