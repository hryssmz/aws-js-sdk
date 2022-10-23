// lambda/scripts/updateFunction.ts
import { mkdir, rm, writeFile } from "node:fs/promises";
import { LambdaWrapper } from "..";
import { zip } from "../../utils";
import { funcDir } from "../../utils/dummy";
import { funcName, jsCodeStr } from "./args";

async function main() {
  const lambda = new LambdaWrapper();
  await rm(funcDir, { recursive: true, force: true });
  await mkdir(funcDir, { recursive: true });
  await writeFile(`${funcDir}/index.js`, jsCodeStr);
  const ZipFile = await zip(funcDir);
  await rm(funcDir, { recursive: true, force: true });
  const { FunctionArn } = await lambda.updateFunctionCode({
    ZipFile,
    FunctionName: funcName,
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
