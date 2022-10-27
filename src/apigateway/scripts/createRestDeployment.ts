// apigateway/scripts/createRestDeployment.ts
import { APIGatewayWrapper } from "..";
import { resourcePath, restApiName, stageName } from "./args";
import { region } from "../../utils";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  await apigateway.createDeployment({
    restApiId,
    stageName,
  });
  return `https://${restApiId}.execute-api.${region}.amazonaws.com/${stageName}${resourcePath}`;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
