// apigatewayv2/scripts/createHttpApi.ts
import { ApiGatewayV2Wrapper } from "..";
import { httpApiName } from "./args";

async function main() {
  const apigatewayv2 = new ApiGatewayV2Wrapper();
  await apigatewayv2.createApi({ Name: httpApiName, ProtocolType: "HTTP" });
  return httpApiName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
