// lambda/__tests__/legacy.spec.ts
import { mkdir, rm, writeFile } from "node:fs/promises";
import {
  Architecture,
  LogType,
  PackageType,
  Runtime,
} from "@aws-sdk/client-lambda";
import {
  createRole,
  attachRolePolicy,
  deleteRolesByPrefix,
  getRole,
} from "../../iam";
import {
  createFunction,
  deleteFunction,
  deleteFunctionsByPrefix,
  getFunction,
  invoke,
  listFunctions,
  updateFunctionCode,
  updateFunctionConfiguration,
} from "../legacy";
import { funcDir, funcName, roleName } from "./dummy";
import { isLocal, sleep, zip } from "./utils";

jest.setTimeout((isLocal ? 5 : 30) * 1000);

describe("Functions API", () => {
  beforeAll(async () => {
    await deleteRolesByPrefix(roleName);
    await createRole({
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
    await attachRolePolicy({
      PolicyArn:
        "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
      RoleName: roleName,
    });
    await sleep(isLocal ? 0 : 15);
  });

  beforeEach(async () => {
    await rm(funcDir, { recursive: true, force: true });
    await mkdir(funcDir, { recursive: true });
    await deleteFunctionsByPrefix(funcName);
  });

  afterAll(async () => {
    await rm(funcDir, { recursive: true, force: true });
    await deleteFunctionsByPrefix(funcName);
    await deleteRolesByPrefix(roleName);
  });

  const getNumberOfFunctions = async () => {
    const { Functions } = await listFunctions({});
    return Functions?.length ?? 0;
  };

  test("Create, get, list, and delete function", async () => {
    const numberOfFunctions = await getNumberOfFunctions();
    const { Role } = await getRole({ RoleName: roleName });
    const jsCodeStr = `
      exports.handler = function (event) {
        console.log(JSON.stringify(event));
      };
    `;
    await writeFile(`${funcDir}/index.js`, jsCodeStr);
    const code = await zip(funcDir);
    await createFunction({
      Code: { ZipFile: code },
      FunctionName: funcName,
      Role: Role?.Arn,
      Architectures: [Architecture.arm64],
      Handler: "index.handler",
      PackageType: PackageType.Zip,
      Runtime: Runtime.nodejs16x,
    });

    expect(await getNumberOfFunctions()).toBe(numberOfFunctions + 1);

    const { Configuration } = await getFunction({
      FunctionName: funcName,
    });

    expect(Configuration?.FunctionName).toBe(funcName);
    expect(Configuration?.Handler).toBe("index.handler");

    await deleteFunction({ FunctionName: funcName });

    expect(await getNumberOfFunctions()).toBe(0);
  });

  test("invoke and update the function", async () => {
    const { Role } = await getRole({ RoleName: roleName });
    const jsCodeStr = `
      exports.handler = function (event) {
        console.log(JSON.stringify(event));
      };
    `;
    await writeFile(`${funcDir}/index.js`, jsCodeStr);
    const code = await zip(funcDir);
    await createFunction({
      Code: { ZipFile: code },
      FunctionName: funcName,
      Role: Role?.Arn,
      Architectures: [Architecture.arm64],
      Handler: "index.handler",
      PackageType: PackageType.Zip,
      Runtime: Runtime.nodejs16x,
    });

    await sleep(isLocal ? 0 : 5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invokeCurrentFunction = async (args: any) => {
      const { LogResult, Payload } = await invoke({
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

    const args = { one: 1, foo: "bar" };
    const { result: result1, logs: logs1 } = await invokeCurrentFunction(args);

    expect(result1).toBeNull();
    expect(JSON.parse(logs1[1].split("\t")[3])).toStrictEqual(args);

    const jsCodeStr2 = `
      exports.handler = function () {
        console.log(process.env.foo);
      };
    `;
    await writeFile(`${funcDir}/index.js`, jsCodeStr2);
    const code2 = await zip(funcDir);
    await updateFunctionCode({
      ZipFile: code2,
      FunctionName: funcName,
    });

    await sleep(isLocal ? 0 : 5);

    const envFoo = "bar";
    await updateFunctionConfiguration({
      FunctionName: funcName,
      Environment: { Variables: { foo: envFoo } },
    });

    await sleep(isLocal ? 0 : 5);

    const { result: result2, logs: logs2 } = await invokeCurrentFunction({});

    expect(result2).toBeNull();
    expect(logs2[1].split("\t")[3]).toBe(envFoo);
  });

  test("deleteFunctionsByPrefix() helper", async () => {
    const numberOfFunctions = await getNumberOfFunctions();
    const { Role } = await getRole({ RoleName: roleName });
    const jsCodeStr = `
      exports.handler = function (event) {
        console.log(JSON.stringify(event));
      };
    `;
    await writeFile(`${funcDir}/index.js`, jsCodeStr);
    const code = await zip(funcDir);
    await createFunction({
      Code: { ZipFile: code },
      FunctionName: funcName,
      Role: Role?.Arn,
      Architectures: [Architecture.arm64],
      Handler: "index.handler",
      PackageType: PackageType.Zip,
      Runtime: Runtime.nodejs16x,
    });

    expect(await getNumberOfFunctions()).toBe(numberOfFunctions + 1);

    await deleteFunctionsByPrefix(funcName);

    expect(await getNumberOfFunctions()).toBe(0);
  });
});
