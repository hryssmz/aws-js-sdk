// apigatewayv2/actions.ts
import { ApiGatewayV2Wrapper } from ".";
import type { Action } from "../utils";

const httpApiName = "my-http-api";
const httpRouteKey = "GET /my-endpoint";

async function createHttpApi() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  await apigatewayv2.createApi({ Name: httpApiName, ProtocolType: "HTTP" });
  return JSON.stringify(httpApiName, null, 2);
}

async function createHttpRoute() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  const { ApiId } = await apigatewayv2.getApiByName(httpApiName);
  await apigatewayv2.createRoute({ ApiId, RouteKey: httpRouteKey });
  return JSON.stringify(httpRouteKey, null, 2);
}

async function deleteHttpApi() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  const { ApiId } = await apigatewayv2.getApiByName(httpApiName);
  await apigatewayv2.deleteApi({ ApiId });
  return JSON.stringify(httpApiName, null, 2);
}

async function deleteHttpRoute() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  const { ApiId } = await apigatewayv2.getApiByName(httpApiName);
  const { RouteId } = await apigatewayv2.getRouteByKey(httpRouteKey, ApiId);
  await apigatewayv2.deleteRoute({ ApiId, RouteId });
  return JSON.stringify(httpRouteKey, null, 2);
}

const actions: Record<string, Action> = {
  createHttpApi,
  createHttpRoute,
  deleteHttpApi,
  deleteHttpRoute,
};

export default actions;
