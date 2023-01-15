// appsync/index.ts
import {
  AppSyncClient,
  GetGraphqlApiCommand,
  GetResolverCommand,
  GetTypeCommand,
  ListGraphqlApisCommand,
} from "@aws-sdk/client-appsync";
import { defaultClientConfig } from "../utils";
import type {
  AppSyncClientConfig,
  GetGraphqlApiCommandInput,
  GetTypeCommandInput,
  GetResolverCommandInput,
  ListGraphqlApisCommandInput,
} from "@aws-sdk/client-appsync";

export const defaultAppSyncClientConfig = {
  ...defaultClientConfig,
};

export class AppSyncWrapper {
  client: AppSyncClient;

  constructor(config?: AppSyncClientConfig) {
    this.client = new AppSyncClient({
      ...defaultAppSyncClientConfig,
      ...config,
    });
  }

  async getGraphqlApi(params: GetGraphqlApiCommandInput) {
    const command = new GetGraphqlApiCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getType(params: GetTypeCommandInput) {
    const command = new GetTypeCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getResolver(params: GetResolverCommandInput) {
    const command = new GetResolverCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listGraphqlApis(params: ListGraphqlApisCommandInput) {
    const command = new ListGraphqlApisCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getGraphqlApiId(name: string) {
    const { graphqlApis } = await this.listGraphqlApis({});
    const { apiId } =
      graphqlApis?.filter(graphqlApi => name === graphqlApi.name)[0] ?? {};
    return apiId ?? "";
  }
}
