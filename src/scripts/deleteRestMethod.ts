// scripts/deleteRestMethod.ts
import { APIGatewayWrapper } from "../apigateway";
import { resourcePath, restApiName, restMethod } from "./args";

async function main() {
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
  return `${restMethod} ${resourcePath}`;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
