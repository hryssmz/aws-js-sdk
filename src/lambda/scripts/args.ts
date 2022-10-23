// lambda/scripts/args.ts
import type { UpdateFunctionConfigurationCommandInput } from "@aws-sdk/client-lambda";

export const funcName = "my-function";
export const jsCodeStr = `// index.js
exports.handler = function (event) {
  console.log(JSON.stringify(event));
  // console.log(process.env.foo);
  // throw new Error("Failed...");
};
`;
export const payload = { a: 1 };
export const lambdaRoleName = "lambda-basic-execution-role";
export const lambdaPolicyArn =
  "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";
export const funcConfig: UpdateFunctionConfigurationCommandInput = {
  FunctionName: funcName,
  Environment: { Variables: { foo: "bar" } },
};
