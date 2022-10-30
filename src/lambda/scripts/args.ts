// lambda/scripts/args.ts
import type { UpdateFunctionConfigurationCommandInput } from "@aws-sdk/client-lambda";

export const funcDir = `${__dirname}/my-func`;
export const funcName = "my-function";
export const codePath = `${__dirname}/files/${funcName}.js`;
export const payload = { path: "/my-endpoint" };
export const lambdaRoleName = "lambda-basic-execution-role";
export const lambdaPolicyArn =
  "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";
export const funcConfig: UpdateFunctionConfigurationCommandInput = {
  FunctionName: funcName,
  Environment: { Variables: { foo: "bar" } },
};
