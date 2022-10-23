// scripts/createRestApi.ts
import { APIGatewayWrapper } from "../apigateway";
import { restApiName } from "./args";

async function main() {
  const apigateway = new APIGatewayWrapper();
  await apigateway.createRestApi({ name: restApiName });
  return restApiName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
