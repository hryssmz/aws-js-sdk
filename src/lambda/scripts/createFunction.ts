// lambda/scripts/createFunction.ts
import { cp, mkdir, rm } from "node:fs/promises";
import { Architecture, PackageType, Runtime } from "@aws-sdk/client-lambda";
import { LambdaWrapper } from "..";
import { IAMWrapper } from "../../iam";
import { zip } from "../../utils";
import { codePath, funcDir, funcName, lambdaRoleName } from "./args";

async function main() {
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
  return FunctionArn;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
