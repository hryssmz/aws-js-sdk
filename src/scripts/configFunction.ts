// scripts/configFunction.ts
import { LambdaWrapper } from "../lambda";
import { funcConfig } from "./args";

async function main() {
  const lambda = new LambdaWrapper();
  const { FunctionArn } = await lambda.updateFunctionConfiguration(funcConfig);
  return FunctionArn;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
