// scripts/wrappers.ts
import { mkdir, rm, writeFile } from "node:fs/promises";
import {
  Architecture,
  LogType,
  PackageType,
  Runtime,
} from "@aws-sdk/client-lambda";
import { IAMWrapper } from "../iam";
import { LambdaWrapper } from "../lambda";
import { isLocal, sleep, zip } from "../utils";
import { funcDir } from "../utils/dummy";

export class FunctionWrapper {
  iam: IAMWrapper;
  lambda: LambdaWrapper;

  constructor() {
    this.iam = new IAMWrapper();
    this.lambda = new LambdaWrapper();
  }

  async createFunction(
    FunctionName: string,
    RoleName: string,
    jsCodeStr: string
  ) {
    const { Role } = await this.iam.getRole({ RoleName });
    await rm(funcDir, { recursive: true, force: true });
    await mkdir(funcDir, { recursive: true });
    await writeFile(`${funcDir}/index.js`, jsCodeStr);
    const ZipFile = await zip(funcDir);
    await rm(funcDir, { recursive: true, force: true });
    const { FunctionArn } = await this.lambda.createFunction({
      Code: { ZipFile },
      FunctionName,
      Role: Role?.Arn,
      Architectures: [Architecture.arm64],
      Handler: "index.handler",
      PackageType: PackageType.Zip,
      Runtime: Runtime.nodejs16x,
    });
    return FunctionArn;
  }

  async createLambdaRole(RoleName: string) {
    const PolicyArn =
      "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";
    console.log(RoleName);
    const { Role } = await this.iam.createRole({
      RoleName,
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
    await this.iam.attachRolePolicy({ PolicyArn, RoleName });
    await sleep(isLocal ? 0 : 15);
    return Role;
  }

  async invokeFunction(FunctionName: string, payloadStr = "{}") {
    const { LogResult, Payload } = await this.lambda.invoke({
      FunctionName,
      Payload: Buffer.from(payloadStr),
      LogType: LogType.Tail,
    });
    console.log(Buffer.from(LogResult ?? "", "base64").toString());
    const result = JSON.parse(Buffer.from(Payload ?? []).toString());
    return result;
  }

  async updateFunctionCode(FunctionName: string, jsCodeStr: string) {
    await rm(funcDir, { recursive: true, force: true });
    await mkdir(funcDir, { recursive: true });
    await writeFile(`${funcDir}/index.js`, jsCodeStr);
    const ZipFile = await zip(funcDir);
    await rm(funcDir, { recursive: true, force: true });
    const { FunctionArn } = await this.lambda.updateFunctionCode({
      ZipFile,
      FunctionName,
    });
    return FunctionArn;
  }
}

export class UserWrapper {
  iam: IAMWrapper;

  constructor() {
    this.iam = new IAMWrapper();
  }

  async deleteUser(UserName: string) {
    await this.detachAllUserPolicies(UserName);
    await this.iam.deleteAllUserPolicies(UserName);
    await this.iam.deleteUser({ UserName });
    /* c8 ignore next */
    return UserName ?? "";
  }

  async detachAllUserPolicies(UserName?: string) {
    const handlePolicyError = async (
      error: Error,
      PolicyArn?: string,
      PolicyName?: string
    ) => {
      if (
        PolicyArn !== undefined &&
        PolicyName !== undefined &&
        error.name === "NoSuchEntityException" &&
        error.message.includes(PolicyArn)
      ) {
        const arnList = PolicyArn.split(":");
        const resource = arnList[arnList.length - 1];
        const Path = resource
          .replace(/^policy/, "")
          .replace(new RegExp(PolicyName + "$"), "");
        await this.iam.createPolicy({
          PolicyName,
          Path,
          PolicyDocument: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              { Effect: "Allow", Action: "s3:GetObject", Resource: "*" },
            ],
          }),
        });
        const result = await this.iam.detachUserPolicy({ UserName, PolicyArn });
        await this.iam.deletePolicy({ PolicyArn });
        return result;
      } else {
        throw error;
      }
    };
    const { AttachedPolicies } = await this.iam.listAttachedUserPolicies({
      UserName,
    });
    const promises =
      AttachedPolicies?.map(async ({ PolicyArn, PolicyName }) => {
        const result = await this.iam
          .detachUserPolicy({
            UserName,
            PolicyArn,
          })
          .catch(async error => {
            const result = await handlePolicyError(
              error,
              PolicyArn,
              PolicyName
            );
            return result;
          });
        return result;
        /* c8 ignore next */
      }) ?? [];
    const results = await Promise.all(promises);
    return results;
  }
}
