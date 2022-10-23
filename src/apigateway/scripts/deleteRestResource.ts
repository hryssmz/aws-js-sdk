// apigateway/scripts/deleteRestResource.ts
import { APIGatewayWrapper } from "..";
import { resourcePath, restApiName } from "./args";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: resourceId } = await apigateway.getResourceByPath(
    resourcePath,
    restApiId
  );
  await apigateway.deleteResource({ restApiId, resourceId });
  return resourcePath;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
