// cloudformation/actions.ts
import { readFile } from "node:fs/promises";
import { CloudFormationWrapper } from ".";
import type { Parameter } from "@aws-sdk/client-cloudformation";
import type { Action } from "../utils";

const stackName = "http-non-proxy-api";
const templateDir = `${__dirname}/../../src/cloudformation/files`;
const templatePath = `${templateDir}/${stackName}.yaml`;
const parameters: Parameter[] = [
  // { ParameterKey: "AxiosLayerBucket", ParameterValue: "my-bucket-hryssmz" },
  // { ParameterKey: "AxiosLayerKey", ParameterValue: "AxiosLayer.zip" },
];

async function createStack() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.createStack({
    StackName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
    Capabilities: ["CAPABILITY_IAM"],
  });
  return JSON.stringify(stackName, null, 2);
}

async function deleteStack() {
  const cloudformation = new CloudFormationWrapper();
  await cloudformation.deleteStack({ StackName: stackName });
  return JSON.stringify(stackName, null, 2);
}

async function describeStack() {
  const cloudformation = new CloudFormationWrapper();
  const { Stacks } = await cloudformation.describeStacks({
    StackName: stackName,
  });
  const outputs = Stacks?.[0].Outputs?.reduce(
    (acc, { OutputKey, OutputValue }) =>
      OutputKey !== undefined && OutputValue !== undefined
        ? { ...acc, [OutputKey]: OutputValue }
        : acc,
    {} as Record<string, string>
  );
  return JSON.stringify(outputs, null, 2);
}

async function updateStack() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.updateStack({
    StackName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
    Capabilities: ["CAPABILITY_IAM"],
  });
  return JSON.stringify(stackName, null, 2);
}

async function validateTemplate() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.validateTemplate({
    TemplateBody: templateBody,
  });
  return JSON.stringify({}, null, 2);
}

const actions: Record<string, Action> = {
  createStack,
  deleteStack,
  describeStack,
  updateStack,
  validateTemplate,
};

export default actions;
