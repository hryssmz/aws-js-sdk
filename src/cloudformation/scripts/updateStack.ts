// cloudformation/scripts/updateStack.ts
import { readFile } from "node:fs/promises";
import { CloudFormationWrapper } from "..";
import { parameters, stackName, templatePath } from "./args";

async function main() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.updateStack({
    StackName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
  });
  return stackName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
