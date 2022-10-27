// apigateway/wrapper.ts
import {
  APIGatewayClient,
  CreateDeploymentCommand,
  CreateResourceCommand,
  CreateRestApiCommand,
  CreateStageCommand,
  DeleteDeploymentCommand,
  DeleteIntegrationCommand,
  DeleteMethodCommand,
  DeleteResourceCommand,
  DeleteRestApiCommand,
  DeleteStageCommand,
  GetDeploymentCommand,
  GetDeploymentsCommand,
  GetIntegrationCommand,
  GetMethodCommand,
  GetResourceCommand,
  GetResourcesCommand,
  GetRestApiCommand,
  GetRestApisCommand,
  GetStageCommand,
  PutIntegrationCommand,
  PutMethodCommand,
} from "@aws-sdk/client-api-gateway";
import { defaultClientConfig, sleep } from "../utils";
import type {
  APIGatewayClientConfig,
  CreateDeploymentCommandInput,
  CreateResourceCommandInput,
  CreateRestApiCommandInput,
  CreateRestApiCommandOutput,
  CreateStageCommandInput,
  DeleteDeploymentCommandInput,
  DeleteIntegrationCommandInput,
  DeleteMethodCommandInput,
  DeleteResourceCommandInput,
  DeleteRestApiCommandInput,
  DeleteRestApiCommandOutput,
  DeleteStageCommandInput,
  GetDeploymentCommandInput,
  GetDeploymentsCommandInput,
  GetIntegrationCommandInput,
  GetMethodCommandInput,
  GetResourceCommandInput,
  GetResourcesCommandInput,
  GetRestApiCommandInput,
  GetRestApisCommandInput,
  GetStageCommandInput,
  PutIntegrationCommandInput,
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

  async createDeployment(params: CreateDeploymentCommandInput) {
    const command = new CreateDeploymentCommand(params);
    const result = await this.client.send(command);
    return result;
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

  async createStage(params: CreateStageCommandInput) {
    const command = new CreateStageCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteDeployment(params: DeleteDeploymentCommandInput) {
    const command = new DeleteDeploymentCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteIntegration(params: DeleteIntegrationCommandInput) {
    const command = new DeleteIntegrationCommand(params);
    const result = await this.client.send(command);
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

  async deleteStage(params: DeleteStageCommandInput) {
    const command = new DeleteStageCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getDeployment(params: GetDeploymentCommandInput) {
    const command = new GetDeploymentCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getDeployments(params: GetDeploymentsCommandInput) {
    const command = new GetDeploymentsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getIntegration(params: GetIntegrationCommandInput) {
    const command = new GetIntegrationCommand(params);
    const result = await this.client.send(command);
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

  async getStage(params: GetStageCommandInput) {
    const command = new GetStageCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putIntegration(params: PutIntegrationCommandInput) {
    const command = new PutIntegrationCommand(params);
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
