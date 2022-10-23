// lambda/scripts/invokeFunction.ts
import { LogType } from "@aws-sdk/client-lambda";
import { LambdaWrapper } from "..";
import { funcName, payload } from "./args";

async function main() {
  const lambda = new LambdaWrapper();
  const { LogResult, Payload } = await lambda.invoke({
    FunctionName: funcName,
    Payload: Buffer.from(JSON.stringify(payload)),
    LogType: LogType.Tail,
  });
  console.log(Buffer.from(LogResult ?? "", "base64").toString());
  const result = JSON.parse(Buffer.from(Payload ?? []).toString());
  return result;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
