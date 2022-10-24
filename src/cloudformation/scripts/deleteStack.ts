// cloudformation/scripts/deleteStack.ts
import { CloudFormationWrapper } from "..";
import { stackName } from "./args";

async function main() {
  const cloudformation = new CloudFormationWrapper();
  await cloudformation.deleteStack({ StackName: stackName });
  return stackName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
