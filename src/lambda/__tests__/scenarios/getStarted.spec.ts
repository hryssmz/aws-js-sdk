// lambda/__tests__/scenarios/getStarted.spec.ts
import { mkdir, rm, writeFile } from "node:fs/promises";
import {
  Architecture,
  LogType,
  PackageType,
  Runtime,
} from "@aws-sdk/client-lambda";
import { LambdaWrapper } from "../..";
import { IAMWrapper } from "../../../iam";
import { funcDir, funcName, roleName } from "../dummy";
import { isLocal, sleep, zip } from "../utils";

jest.setTimeout((isLocal ? 10 : 60) * 1000);

const lambda = new LambdaWrapper();
const iam = new IAMWrapper();

beforeAll(async () => {
  await rm(funcDir, { recursive: true, force: true });
  await mkdir(funcDir, { recursive: true });
  await lambda.deleteFunctionsByPrefix(funcName);
  await iam.deleteRolesByPrefix(roleName);
});

afterAll(async () => {
  await rm(funcDir, { recursive: true, force: true });
  await lambda.deleteFunctionsByPrefix(funcName);
  await iam.deleteRolesByPrefix(roleName);
});

test("Get started creating and invoking Lambda functions", async () => {
  const policyArn =
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";

  // Create a role for lambda function.
  const { Role } = await iam.createRole({
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { Service: "lambda.amazonaws.com" },
          Action: "sts:AssumeRole",
        },
      ],
    }),
  });

  // Attach AWSLambdaBasicExecutionRole policy to the role.
  await iam.attachRolePolicy({ PolicyArn: policyArn, RoleName: roleName });

  // Need to wait until the role has become active.
  await sleep(isLocal ? 0 : 15);

  // Create a Lambda function
  const jsCodeStr = `
    exports.handler = function (event) {
      console.log(JSON.stringify(event));
    };
  `;
  await writeFile(`${funcDir}/index.js`, jsCodeStr);
  const code = await zip(funcDir);
  await lambda.createFunction({
    Code: { ZipFile: code },
    FunctionName: funcName,
    Role: Role?.Arn,
    Architectures: [Architecture.arm64],
    Handler: "index.handler",
    PackageType: PackageType.Zip,
    Runtime: Runtime.nodejs16x,
  });

  // List the functions.
  const { Functions } = await lambda.listFunctions({});

  expect(
    Functions?.findIndex(({ FunctionName }) => FunctionName === funcName)
  ).toBeGreaterThan(-1);

  // Need to wait until the function is ready to invoke.
  await sleep(isLocal ? 0 : 5);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invokeCurrentFunction = async (args: any) => {
    const { LogResult, Payload } = await lambda.invoke({
      FunctionName: funcName,
      Payload: Buffer.from(JSON.stringify(args)),
      LogType: LogType.Tail,
    });
    const result = JSON.parse(Buffer.from(Payload ?? []).toString());
    const logs = Buffer.from(LogResult ?? "", "base64")
      .toString()
      .split("\n");
    return { result, logs };
  };

  // Invoke the function.
  const args = { one: 1, foo: "bar" };
  const { result: result1, logs: logs1 } = await invokeCurrentFunction(args);

  expect(result1).toBeNull();
  expect(JSON.parse(logs1[1].split("\t")[3])).toStrictEqual(args);

  // Update the function.
  const jsCodeStr2 = `
    exports.handler = function () {
      console.log(process.env.foo);
    };
  `;
  await writeFile(`${funcDir}/index.js`, jsCodeStr2);
  const code2 = await zip(funcDir);
  await lambda.updateFunctionCode({
    ZipFile: code2,
    FunctionName: funcName,
  });

  // Need to wait until the function has finished updating.
  await sleep(isLocal ? 0 : 5);

  const envFoo = "bar";
  await lambda.updateFunctionConfiguration({
    FunctionName: funcName,
    Environment: { Variables: { foo: envFoo } },
  });

  // Need to wait until the function has finished updating.
  await sleep(isLocal ? 0 : 5);

  // Invoke the updated function.
  const { result: result2, logs: logs2 } = await invokeCurrentFunction({});

  expect(result2).toBeNull();
  expect(logs2[1].split("\t")[3]).toBe(envFoo);

  // Delete the function.
  await lambda.deleteFunction({ FunctionName: funcName });

  // Detach the policy.
  await iam.detachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

  // Delete the role.
  await iam.deleteRole({ RoleName: roleName });
});
