// apigateway/scripts/createRestResource.ts
import { APIGatewayWrapper } from "..";
import { pathPart, resourceParent, restApiName } from "./args";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: parentId } = await apigateway.getResourceByPath(
    resourceParent,
    restApiId
  );
  await apigateway.createResource({ restApiId, pathPart, parentId });
  return `${resourceParent.replace(/\/$/, "")}/${pathPart}`;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
