// apigateway/wrapper.ts
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
import { defaultClientConfig, sleep } from "../utils";
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

export const defaultAPIGatewayClientConfig = {
  ...defaultClientConfig,
};

export class APIGatewayWrapper {
  client: APIGatewayClient;

  constructor(config?: APIGatewayClientConfig) {
    this.client = new APIGatewayClient({
      ...defaultAPIGatewayClientConfig,
      ...config,
    });
  }

  async createResource(params: CreateResourceCommandInput) {
    const command = new CreateResourceCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createRestApi(
    params: CreateRestApiCommandInput
  ): Promise<CreateRestApiCommandOutput> {
    const command = new CreateRestApiCommand(params);
    const result = await this.client
      .send(command)
      .catch(async (error: Error) => {
        /* c8 ignore next 7 */
        if (error.name === "TooManyRequestsException") {
          await sleep(3);
          const result = await this.createRestApi(params);
          return result;
        } else {
          throw error;
        }
      });
    return result;
  }

  async deleteMethod(params: DeleteMethodCommandInput) {
    const command = new DeleteMethodCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteResource(params: DeleteResourceCommandInput) {
    const command = new DeleteResourceCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteRestApi(
    params: DeleteRestApiCommandInput
  ): Promise<DeleteRestApiCommandOutput> {
    const command = new DeleteRestApiCommand(params);
    const result = await this.client
      .send(command)
      .catch(async (error: Error) => {
        /* c8 ignore next 7 */
        if (error.name === "TooManyRequestsException") {
          await sleep(30);
          const result = await this.deleteRestApi(params);
          return result;
        } else {
          throw error;
        }
      });
    return result;
  }

  async getMethod(params: GetMethodCommandInput) {
    const command = new GetMethodCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getResource(params: GetResourceCommandInput) {
    const command = new GetResourceCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getResources(params: GetResourcesCommandInput) {
    const command = new GetResourcesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getRestApi(params: GetRestApiCommandInput) {
    const command = new GetRestApiCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getRestApis(params: GetRestApisCommandInput) {
    const command = new GetRestApisCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putMethod(params: PutMethodCommandInput) {
    const command = new PutMethodCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteAllMethods(restApiId?: string, resourceId?: string) {
    const { resourceMethods } = await this.getResource({
      restApiId,
      resourceId,
    });
    /* c8 ignore next */
    const promises = Object.keys(resourceMethods ?? {}).map(
      async httpMethod => {
        const result = await this.deleteMethod({
          restApiId,
          resourceId,
          httpMethod,
        });
        return result;
      }
    );
    const results = await Promise.all(promises);
    return results;
  }

  async deleteAllResources(restApiId?: string) {
    const { items } = await this.getResources({ restApiId });
    const promises =
      items
        ?.filter(({ path }) => path !== "/")
        .map(async ({ id }) => {
          const result = await this.deleteResource({
            resourceId: id,
            restApiId,
          });
          return result;
          /* c8 ignore next */
        }) ?? [];
    const results = await Promise.all(promises);
    return results;
  }

  async deleteRestApisByPrefix(prefix: string) {
    const { items } = await this.getRestApis({});
    const promises =
      items
        ?.filter(({ name }) => name?.startsWith(prefix))
        .map(async ({ id }) => {
          const result = await this.deleteRestApi({ restApiId: id });
          return result;
          /* c8 ignore next */
        }) ?? [];
    const results = await Promise.all(promises);
    return results;
  }

  async getResourceByPath(path: string, restApiId?: string) {
    const { items } = await this.getResources({ restApiId });
    const result = items?.find(item => item.path === path);
    if (result === undefined) {
      throw new Error(`Resource path not found: ${path}`);
    }
    return result;
  }

  async getRestApiByName(name: string) {
    const { items } = await this.getRestApis({});
    const result = items?.find(item => item.name === name);
    if (result === undefined) {
      throw new Error(`REST API not found: ${name}`);
    }
    return result;
  }
}
