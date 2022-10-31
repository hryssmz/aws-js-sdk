// action.ts
import apigatewayActions from "./apigateway/actions";
import apigatewayv2Actions from "./apigatewayv2/actions";
import cloudformationActions from "./cloudformation/actions";
import dynamodbActions from "./dynamodb/actions";
import ec2Actions from "./ec2/actions";
import iamActions from "./iam/actions";
import lambdaActions from "./lambda/actions";
import s3Actions from "./s3/actions";
import { camelize } from "./utils";
import type { Action } from "./utils";

const actions: Record<string, Action> = {
  ...apigatewayActions,
  ...apigatewayv2Actions,
  ...cloudformationActions,
  ...dynamodbActions,
  ...ec2Actions,
  ...iamActions,
  ...lambdaActions,
  ...s3Actions,
};

async function main() {
  const actionName = process.argv[2];
  const actionArgs = process.argv.slice(2);
  if (!(camelize(actionName) in actions)) {
    throw new Error(`Action not found: ${actionName}`);
  }
  const action = actions[camelize(actionName)];
  return action(...actionArgs);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(({ message }: Error) => {
    console.error(message);
  });