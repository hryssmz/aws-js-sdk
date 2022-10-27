// apigateway/scripts/createRestMethod.ts
import { APIGatewayWrapper } from "..";
import { LambdaWrapper } from "../../lambda";
import {
  lambdaPolicyStmtId,
  resourcePath,
  restApiName,
  restAuth,
  restMethod,
} from "./args";
import { funcName } from "../../lambda/scripts/args";
import { region } from "../../utils";

async function main() {
  const apigateway = new APIGatewayWrapper();
  const lambda = new LambdaWrapper();
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
  const { Configuration } = await lambda.getFunction({
    FunctionName: funcName,
  });
  await apigateway.putIntegration({
    restApiId,
    resourceId,
    httpMethod: restMethod,
    type: "AWS_PROXY",
    integrationHttpMethod: "POST",
    uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${Configuration?.FunctionArn}/invocations`,
  });
  await lambda
    .addPermission({
      StatementId: lambdaPolicyStmtId,
      Action: "lambda:InvokeFunction",
      FunctionName: funcName,
      Principal: "apigateway.amazonaws.com",
    })
    .catch(e => e);
  return `${restMethod} ${resourcePath}`;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
