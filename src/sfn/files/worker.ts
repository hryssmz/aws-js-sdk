// sfn/files/worker.ts
import { SFNWrapper } from "..";

function getGreeting(who: string): string {
  return JSON.stringify({ Hello: who });
}

async function main() {
  const sfn = new SFNWrapper();
  const activityArn =
    "arn:aws:states:ap-northeast-1:512667299293:activity:GetGreeting";
  const { input, taskToken } = await sfn.getActivityTask({ activityArn });
  const { who } = JSON.parse(input ?? "{}");
  const output = getGreeting(who);
  await sfn.sendTaskSuccess({ output, taskToken });
  return output;
}

main().then(console.log);
