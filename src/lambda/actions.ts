// lambda/actions.ts
import { cp, mkdir, rm } from "node:fs/promises";
import {
  Architecture,
  LogType,
  PackageType,
  Runtime,
} from "@aws-sdk/client-lambda";
import { LambdaWrapper } from ".";
import { IAMWrapper } from "../iam";
import { S3Wrapper } from "../s3";
import { accountAlias, zip } from "../utils";
import type { UpdateFunctionConfigurationCommandInput } from "@aws-sdk/client-lambda";
import type { Action } from "../utils";

const funcDir = `${__dirname}/my-func`;
const funcName = "my-function";
const codeDir = `${__dirname}/../../src/lambda/files`;
const codePath = `${codeDir}/${funcName}.js`;
const payload = { path: "/my-endpoint" };
const lambdaRoleName = "lambda-basic-execution-role";
const lambdaPolicyArn =
  "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";
const funcConfig: UpdateFunctionConfigurationCommandInput = {
  FunctionName: funcName,
  Environment: { Variables: { foo: "bar" } },
};
const bucket = `my-bucket-${accountAlias}`;
const layerName = "AxiosLayer";
const layerDir = `${__dirname}/../../src/lambda/files/axios-layer`;

async function configFunction() {
  const lambda = new LambdaWrapper();
  const { FunctionArn } = await lambda.updateFunctionConfiguration(funcConfig);
  return JSON.stringify(FunctionArn, null, 2);
}

async function createFunction() {
  const lambda = new LambdaWrapper();
  const iam = new IAMWrapper();
  const { Role } = await iam.getRole({ RoleName: lambdaRoleName });
  await rm(funcDir, { recursive: true, force: true });
  await mkdir(funcDir, { recursive: true });
  await cp(codePath, `${funcDir}/index.js`);
  const ZipFile = await zip(funcDir);
  await rm(funcDir, { recursive: true, force: true });
  const { FunctionArn } = await lambda.createFunction({
    Code: { ZipFile },
    FunctionName: funcName,
    Role: Role?.Arn,
    Architectures: [Architecture.arm64],
    Handler: "index.handler",
    PackageType: PackageType.Zip,
    Runtime: Runtime.nodejs16x,
  });
  return JSON.stringify(FunctionArn, null, 2);
}

async function createLambdaRole() {
  const iam = new IAMWrapper();
  const { Role } = await iam.createRole({
    RoleName: lambdaRoleName,
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
  await iam.attachRolePolicy({
    PolicyArn: lambdaPolicyArn,
    RoleName: lambdaRoleName,
  });
  return JSON.stringify(Role?.Arn, null, 2);
}

async function deleteFunction() {
  const lambda = new LambdaWrapper();
  await lambda.deleteFunction({ FunctionName: funcName });
  return JSON.stringify(funcName, null, 2);
}

async function deleteLambdaRole() {
  const iam = new IAMWrapper();
  await iam.detachRolePolicy({
    PolicyArn: lambdaPolicyArn,
    RoleName: lambdaRoleName,
  });
  await iam.deleteRole({ RoleName: lambdaRoleName });
  return JSON.stringify(lambdaRoleName, null, 2);
}

async function invokeFunction() {
  const lambda = new LambdaWrapper();
  const { LogResult, Payload } = await lambda.invoke({
    FunctionName: funcName,
    Payload: Buffer.from(JSON.stringify(payload)),
    LogType: LogType.Tail,
  });
  console.log(Buffer.from(LogResult ?? "", "base64").toString());
  const payloadJson = JSON.parse(Buffer.from(Payload ?? []).toString());
  const result = { ...payloadJson, body: JSON.parse(payloadJson.body) };
  return JSON.stringify(result, null, 2);
}

async function updateFunction() {
  const lambda = new LambdaWrapper();
  await rm(funcDir, { recursive: true, force: true });
  await mkdir(funcDir, { recursive: true });
  await cp(codePath, `${funcDir}/index.js`);
  const ZipFile = await zip(funcDir);
  await rm(funcDir, { recursive: true, force: true });
  const { FunctionArn } = await lambda.updateFunctionCode({
    ZipFile,
    FunctionName: funcName,
  });
  return JSON.stringify(FunctionArn, null, 2);
}

async function uploadLayerZip() {
  const s3 = new S3Wrapper();
  const Body = await zip(layerDir);
  await s3.putObject({ Bucket: bucket, Key: `${layerName}.zip`, Body });
  return JSON.stringify(layerName, null, 2);
}

const actions: Record<string, Action> = {
  configFunction,
  createFunction,
  createLambdaRole,
  deleteFunction,
  deleteLambdaRole,
  invokeFunction,
  updateFunction,
  uploadLayerZip,
};

export default actions;
