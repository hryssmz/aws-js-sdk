// apigateway/actions.ts
import { writeFileSync } from "node:fs";
import { APIGatewayWrapper } from ".";
import { LambdaWrapper } from "../lambda";
import { region } from "../utils";
import type { Action } from "../utils";

const funcName = "my-function";
const restApiName = "aws-sam-python";
const resourceParent = "/";
const pathPart = "my-endpoint";
const resourcePath = `${resourceParent.replace(/\/$/, "")}/${pathPart}`;
const restMethod = "GET";
const restAuth = "NONE";
const stageName = "dev";
const lambdaPolicyStmtId = "MyAPIGatewayInvokeFunction";
const openApiPath = "openapi.yml";

async function createRestApi() {
  const apigateway = new APIGatewayWrapper();
  await apigateway.createRestApi({
    name: restApiName,
    endpointConfiguration: { types: ["REGIONAL"] },
  });
  return JSON.stringify(restApiName, null, 2);
}

async function createRestDeployment() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  await apigateway.createDeployment({
    restApiId,
    stageName,
  });
  const uri = `https://${restApiId}.execute-api.${region}.amazonaws.com/${stageName}${resourcePath}`;
  return JSON.stringify(uri, null, 2);
}

async function createRestMethod() {
  const apigateway = new APIGatewayWrapper();
  const lambda = new LambdaWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: resourceId } = await apigateway.getResourceByPath(
    resourcePath,
    restApiId
  );
  await apigateway.putMethod({
    restApiId,
    resourceId,
    httpMethod: restMethod,
    authorizationType: restAuth,
  });
  const { Configuration } = await lambda.getFunction({
    FunctionName: funcName,
  });
  await apigateway.putIntegration({
    restApiId,
    resourceId,
    httpMethod: restMethod,
    type: "AWS_PROXY",
    integrationHttpMethod: "POST",
    uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${Configuration?.FunctionArn}/invocations`,
  });
  await lambda
    .addPermission({
      StatementId: lambdaPolicyStmtId,
      Action: "lambda:InvokeFunction",
      FunctionName: funcName,
      Principal: "apigateway.amazonaws.com",
    })
    .catch(e => e);
  const route = `${restMethod} ${resourcePath}`;
  return JSON.stringify(route, null, 2);
}

async function createRestResource() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: parentId } = await apigateway.getResourceByPath(
    resourceParent,
    restApiId
  );
  await apigateway.createResource({ restApiId, pathPart, parentId });
  const path = `${resourceParent.replace(/\/$/, "")}/${pathPart}`;
  return JSON.stringify(path, null, 2);
}

async function deleteRestApi() {
  const apigateway = new APIGatewayWrapper();
  const { id } = await apigateway.getRestApiByName(restApiName);
  await apigateway.deleteRestApi({ restApiId: id });
  return JSON.stringify(restApiName, null, 2);
}

async function deleteRestDeployment() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { deploymentId } = await apigateway.getStage({ restApiId, stageName });
  await apigateway.deleteStage({ restApiId, stageName });
  await apigateway.deleteDeployment({ restApiId, deploymentId });
  return JSON.stringify(stageName, null, 2);
}

async function deleteRestMethod() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: resourceId } = await apigateway.getResourceByPath(
    resourcePath,
    restApiId
  );
  await apigateway.deleteMethod({
    restApiId,
    resourceId,
    httpMethod: restMethod,
  });
  const route = `${restMethod} ${resourcePath}`;
  return JSON.stringify(route, null, 2);
}

async function deleteRestResource() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: resourceId } = await apigateway.getResourceByPath(
    resourcePath,
    restApiId
  );
  await apigateway.deleteResource({ restApiId, resourceId });
  return JSON.stringify(resourcePath, null, 2);
}

async function getRestExport() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const response = await apigateway.getExport({
    parameters: { extensions: "apigateway" },
    restApiId,
    stageName,
    exportType: "oas30",
    accepts: "application/yaml",
  });
  if (response.body !== undefined) {
    writeFileSync(openApiPath, response.body);
  }
  return openApiPath;
}

async function getRestIntegration() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: resourceId } = await apigateway.getResourceByPath(
    resourcePath,
    restApiId
  );
  const result = await apigateway.getIntegration({
    restApiId,
    resourceId,
    httpMethod: restMethod,
  });
  return JSON.stringify(result, null, 2);
}

async function getRestMethod() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: resourceId } = await apigateway.getResourceByPath(
    resourcePath,
    restApiId
  );
  const result = await apigateway.getMethod({
    restApiId,
    resourceId,
    httpMethod: restMethod,
  });
  return JSON.stringify(result, null, 2);
}

async function showRestApi() {
  const apigateway = new APIGatewayWrapper();
  const { id, name } = await apigateway.getRestApiByName(restApiName);
  const { items } = await apigateway.getResources({ restApiId: id });
  const resources = items?.map(({ id: resourceId, path, resourceMethods }) => {
    return { id: resourceId, path, methods: resourceMethods };
  });
  const result = { id, name, resources };
  return JSON.stringify(result, null, 2);
}

const actions: Record<string, Action> = {
  createRestApi,
  createRestDeployment,
  createRestMethod,
  createRestResource,
  deleteRestApi,
  deleteRestDeployment,
  deleteRestMethod,
  deleteRestResource,
  getRestExport,
  getRestIntegration,
  getRestMethod,
  showRestApi,
};

export default actions;
