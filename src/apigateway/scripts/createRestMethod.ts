// apigateway/scripts/createRestMethod.ts
import { APIGatewayWrapper } from "..";
import { resourcePath, restApiName, restAuth, restMethod } from "./args";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { id: resourceId } = await apigateway.getResourceByPath(
    resourcePath,
    restApiId
  );
  await apigateway.putMethod({
    restApiId,
    resourceId,
    httpMethod: restMethod,
    authorizationType: restAuth,
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
