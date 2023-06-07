// cloudformation/actions.ts
import { readFile } from "node:fs/promises";
import { CloudFormationWrapper } from ".";
import type { Parameter } from "@aws-sdk/client-cloudformation";
import type { Action } from "../utils";

const stackName = "process-stream";
const templateDir = `${__dirname}/../../src/kinesis/templates`;
const templatePath = `${templateDir}/${stackName}.yml`;
const parameters: Parameter[] = [
  // {
  //   ParameterKey: "PublicKeyBody",
  //   ParameterValue:
  //     "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCaHZxpACCnY3z7+0q03vK5Tai8+VPBorTMBqLptgNgKodmOnUayp7TizM9YBQWGdWQaiiRCKMWbj00loKdSupcBK6olYy/0W2dlo6ZS88s1hi22M1uDpv3wvQXAH7fVP0aHIP3H796s7XNWCbyGjGwSxhuvzSPB0x39q85JR1apHWcH4vnVNzIU3ubHR/nw69UZXASU1qnTl9+DfKC1yuQEJtg2TIiXAdoLStRfQ5T96sStWM5RYVmK0NJkAf9vQfEi03VLJPMZ0ztQOaKy2ebhD9ypZwzZVGuxLt/ilMq+/X4ohsJBjo2Bvnc+3dcBwah4l0FvsH/PpoBlIB6o7NM0dyjxAxH0ReJMEPw0EN4b/yCPR7vQtrl/ey2IeUPz2x364dhiDBIDn0sJJJ5tgqyTxaAS31KX1VwGkN1AQ66De9Mj3KZSNeTKnTedsnqOPLSxzHWb9aG05H6n4dPTSl6rbLcO9ZvDiPZlbo5/pZtsUpGIj2brHWZIZAiEeivPFk= hryssmz@tarte",
  // },
  // { ParameterKey: "MyIP", ParameterValue: "116.64.133.211" },
];

async function createStack() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.createStack({
    StackName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
    Capabilities: ["CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"],
    OnFailure: "DELETE",
    // TimeoutInMinutes: 10,
  });
  return JSON.stringify(stackName, null, 2);
}

async function createStackSet() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = (await readFile(templatePath)).toString();
  await cloudformation.createStackSet({
    StackSetName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
    Capabilities: ["CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"],
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
    Capabilities: ["CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"],
    // DisableRollback: true,
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
  createStackSet,
  deleteStack,
  describeStack,
  updateStack,
  validateTemplate,
};

export default actions;
