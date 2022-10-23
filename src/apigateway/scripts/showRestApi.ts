// apigateway/scripts/showRestApi.ts
import { APIGatewayWrapper } from "..";
import { restApiName } from "./args";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const { id, name } = await apigateway.getRestApiByName(restApiName);
  const { items } = await apigateway.getResources({ restApiId: id });
  const resources = items?.map(({ id: resourceId, path, resourceMethods }) => {
    return { id: resourceId, path, methods: resourceMethods };
  });
  const result = { id, name, resources };
  return JSON.stringify(result, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
