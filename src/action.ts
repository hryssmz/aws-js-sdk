// action.ts
import apigatewayActions from "./apigateway/actions";
import apigatewayv2Actions from "./apigatewayv2/actions";
import appsyncActions from "./appsync/actions";
import cloudformationActions from "./cloudformation/actions";
import cognitoActions from "./cognito/actions";
import dynamodbActions from "./dynamodb/actions";
import ec2Actions from "./ec2/actions";
import iamActions from "./iam/actions";
import kinesisActions from "./kinesis/actions";
import lambdaActions from "./lambda/actions";
import s3Actions from "./s3/actions";
import secretsManagerActions from "./secretsmanager/actions";
import snsActions from "./sns/actions";
import sqsActions from "./sqs/actions";
import stsActions from "./sts/actions";
import { camelize } from "./utils";
import type { Action } from "./utils";

const actions: Record<string, Action> = {
  ...apigatewayActions,
  ...apigatewayv2Actions,
  ...appsyncActions,
  ...cloudformationActions,
  ...cognitoActions,
  ...dynamodbActions,
  ...ec2Actions,
  ...iamActions,
  ...kinesisActions,
  ...lambdaActions,
  ...s3Actions,
  ...secretsManagerActions,
  ...snsActions,
  ...sqsActions,
  ...stsActions,
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
