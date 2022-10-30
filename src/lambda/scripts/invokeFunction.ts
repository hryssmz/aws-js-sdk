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
  const payloadJson = JSON.parse(Buffer.from(Payload ?? []).toString());
  const result = { ...payloadJson, body: JSON.parse(payloadJson.body) };
  return JSON.stringify(result, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
