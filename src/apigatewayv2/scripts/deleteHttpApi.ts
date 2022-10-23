// apigatewayv2/scripts/deleteHttpApi.ts
import { ApiGatewayV2Wrapper } from "..";
import { httpApiName } from "./args";

async function main() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  const { ApiId } = await apigatewayv2.getApiByName(httpApiName);
  await apigatewayv2.deleteApi({ ApiId });
  return httpApiName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
