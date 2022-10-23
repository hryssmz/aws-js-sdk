// scripts/args.ts
import type { UpdateFunctionConfigurationCommandInput } from "@aws-sdk/client-lambda";

// Rest API args
export const restApiName = "my-rest-api";
export const resourceParent = "/";
export const pathPart = "my-endpoint";
export const resourcePath = `${resourceParent.replace(/\/$/, "")}/${pathPart}`;
export const restMethod = "DELETE";
export const restAuth = "NONE";

// HTTP API args
export const httpApiName = "my-http-api";
export const httpRouteKey = "GET /my-endpoint";

// EC2 args
export const keyPairName = "my-key-pair";
export const keyPairPath = `${__dirname}/../../${keyPairName}.pem`;
export const sgName = "my-security-group";
export const cidrIp = "0.0.0.0/0";
export const ec2User = "ec2-user";

// Function args
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
export const funcConfig: UpdateFunctionConfigurationCommandInput = {
  FunctionName: funcName,
  Environment: { Variables: { foo: "bar" } },
};
