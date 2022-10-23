// lambda/scripts/deleteFunction.ts
import { LambdaWrapper } from "..";
import { funcName } from "./args";

async function main() {
  const lambda = new LambdaWrapper();
  await lambda.deleteFunction({ FunctionName: funcName });
  return funcName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
