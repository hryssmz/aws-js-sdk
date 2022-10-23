// apigatewayv2/scripts/createHttpRoute.ts
import { ApiGatewayV2Wrapper } from "..";
import { httpApiName, httpRouteKey } from "./args";

async function main() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  const { ApiId } = await apigatewayv2.getApiByName(httpApiName);
  await apigatewayv2.createRoute({ ApiId, RouteKey: httpRouteKey });
  return httpRouteKey;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
