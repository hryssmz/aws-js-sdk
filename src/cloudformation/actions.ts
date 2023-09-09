// cloudformation/actions.ts
import { readFile } from "node:fs/promises";
import { CloudFormationWrapper } from ".";
import type { Parameter } from "@aws-sdk/client-cloudformation";
import type { Action } from "../utils";

const stackName = "ddb-autoscaling";
const templateDir = `${__dirname}/../../src/dynamodb/templates`;
const templatePath = `${templateDir}/${stackName}.yml`;
const parameters: Parameter[] = [
  // {
  //   ParameterKey: "PublicKeyBody",
  //   ParameterValue:
  //     "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3/8npLHRT/Es4T213AupeM1hBMrbzCJ8ZUUELCoh38Z79B6Ee2wLZ2IZRGmpo0Jj+Dw35UBnw4SjU9wOGHnA7Jn8ZYjWpLeXxN7OpgyBnHgNugiRiYxHYxixEsYdSvfvD+3o5LHHyrFPhMXR2hacTYezsYGGPn+DX+UQZjDwNis+MRPK5nimQ4KHHgQ6PGQIbdWICdGreLNhIWTYT8ONRUWIBnpglNe0QhKd2XvJ1/Z4rwGZiappMDliVmzmrzlOE+riwiBhs4DElkYKk4q3rl9G0IwGQZussVE6r7VpbUbpCVhvMkDu8KUAmG3xYrWcfl1ASd1I/6bu+8Art5SrC5rjsRYbi87QislVHG5us44K5k4N0eSg4Q4CWwjh2r9vXmEEt+ItVY+BzPk0sMtpKghE5toNaAQxEmq2ZYYGkyQ0QzBgLZtBl8dE2pIMJn9ctyT8aWazh4qsKMpJn15wz1qEqwnj7NT6GXwipjoAlemJwD85Bjq/UCnn4EHCM5Ec= hryssmz@smz",
  // },
  // { ParameterKey: "SshCidrIp", ParameterValue: "60.87.155.25/32" },
  // { ParameterKey: "InstanceType", ParameterValue: "t3.micro" },
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
    Tags: [{ Key: "AppManagerCFNStackKey", Value: stackName }],
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
    Tags: [{ Key: "AppManagerCFNStackKey", Value: stackName }],
  });
  return JSON.stringify(stackName, null, 2);
}

async function deleteStack() {
  const cloudformation = new CloudFormationWrapper();
  await cloudformation.deleteStack({ StackName: stackName });
  return JSON.stringify(stackName, null, 2);
}

async function deleteStackSet() {
  const cloudformation = new CloudFormationWrapper();
  await cloudformation.deleteStackSet({ StackSetName: stackName });
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
    Tags: [{ Key: "AppManagerCFNStackKey", Value: stackName }],
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
  deleteStackSet,
  describeStack,
  updateStack,
  validateTemplate,
};

export default actions;
