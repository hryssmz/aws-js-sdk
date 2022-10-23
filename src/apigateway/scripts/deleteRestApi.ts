// apigateway/scripts/deleteRestApi.ts
import { APIGatewayWrapper } from "..";
import { restApiName } from "./args";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const { id } = await apigateway.getRestApiByName(restApiName);
  await apigateway.deleteRestApi({ restApiId: id });
  return restApiName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
