// cloudformation/actions.ts
import { readFile } from "node:fs/promises";
import { CloudFormationWrapper } from ".";
import type { Parameter } from "@aws-sdk/client-cloudformation";
import type { Action } from "../utils";

const stackName = "MyStack";
const templatePath = `${__dirname}/files/template.yaml`;
const parameters: Parameter[] = [
  // { ParameterKey: "InstanceType", ParameterValue: "t1.micro" },
  // { ParameterKey: "KeyName", ParameterValue: "my-key-pair" },
];

async function createStack() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.createStack({
    StackName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
  });
  return JSON.stringify(stackName, null, 2);
}

async function deleteStack() {
  const cloudformation = new CloudFormationWrapper();
  await cloudformation.deleteStack({ StackName: stackName });
  return JSON.stringify(stackName, null, 2);
}

async function updateStack() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.updateStack({
    StackName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
  });
  return JSON.stringify(stackName, null, 2);
}

const actions: Record<string, Action> = {
  createStack,
  deleteStack,
  updateStack,
};

export default actions;
