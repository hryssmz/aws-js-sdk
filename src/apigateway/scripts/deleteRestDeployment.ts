// apigateway/scripts/deleteRestDeployment.ts
import { APIGatewayWrapper } from "..";
import { restApiName, stageName } from "./args";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
  const { deploymentId } = await apigateway.getStage({ restApiId, stageName });
  await apigateway.deleteStage({ restApiId, stageName });
  await apigateway.deleteDeployment({ restApiId, deploymentId });
  return stageName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
