// scripts/deleteHttpRoute.ts
import { ApiGatewayV2Wrapper } from "../apigatewayv2";
import { httpApiName, httpRouteKey } from "./args";

async function main() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  const { ApiId } = await apigatewayv2.getApiByName(httpApiName);
  const { RouteId } = await apigatewayv2.getRouteByKey(httpRouteKey, ApiId);
  await apigatewayv2.deleteRoute({ ApiId, RouteId });
  return httpRouteKey;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
