// cloudformation/actions.ts
import { readFile } from "node:fs/promises";
import { CloudFormationWrapper } from ".";
import { sleep } from "../utils";
import type { Parameter } from "@aws-sdk/client-cloudformation";
import type { Action } from "../utils";

const stackName = "infra-root-ou";
const templateDir = `${__dirname}/../../src/infra/templates`;
const templatePath = `${templateDir}/${stackName}.yml`;
const parameters: Parameter[] = [
  // {
  //   ParameterKey: "PublicKeyBody",
  //   ParameterValue:
  //     "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3/8npLHRT/Es4T213AupeM1hBMrbzCJ8ZUUELCoh38Z79B6Ee2wLZ2IZRGmpo0Jj+Dw35UBnw4SjU9wOGHnA7Jn8ZYjWpLeXxN7OpgyBnHgNugiRiYxHYxixEsYdSvfvD+3o5LHHyrFPhMXR2hacTYezsYGGPn+DX+UQZjDwNis+MRPK5nimQ4KHHgQ6PGQIbdWICdGreLNhIWTYT8ONRUWIBnpglNe0QhKd2XvJ1/Z4rwGZiappMDliVmzmrzlOE+riwiBhs4DElkYKk4q3rl9G0IwGQZussVE6r7VpbUbpCVhvMkDu8KUAmG3xYrWcfl1ASd1I/6bu+8Art5SrC5rjsRYbi87QislVHG5us44K5k4N0eSg4Q4CWwjh2r9vXmEEt+ItVY+BzPk0sMtpKghE5toNaAQxEmq2ZYYGkyQ0QzBgLZtBl8dE2pIMJn9ctyT8aWazh4qsKMpJn15wz1qEqwnj7NT6GXwipjoAlemJwD85Bjq/UCnn4EHCM5Ec= hryssmz@smz",
  // },
  // { ParameterKey: "SshCidrIp", ParameterValue: "60.87.147.140/32" },
  // { ParameterKey: "InstanceType", ParameterValue: "t3.micro" },
];
const organizationalUnitIds = [
  "r-o8rb", // root OU
  // "ou-o8rb-uo9555wh", // Demo OU
];
const suspendedAccounts = [
  "196486007951", // hryssmz3
];
const regions = [
  "ap-northeast-1",
  // "us-east-1"
];
const failureToleranceCount = 0;
const interval = 2;
const maxRetry = 300;

async function createStack() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = await readFile(templatePath, "utf8");
  await cloudformation.createStack({
    StackName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
    Capabilities: ["CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"],
    OnFailure: "DELETE",
    Tags: [{ Key: "AppManagerCFNStackKey", Value: stackName }],
  });
  return JSON.stringify(stackName, null, 2);
}

async function createStackSet() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = await readFile(templatePath, "utf8");
  await cloudformation.createStackSet({
    StackSetName: stackName,
    TemplateBody: templateBody,
    Parameters: parameters,
    Capabilities: ["CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"],
    PermissionModel: "SERVICE_MANAGED",
    AutoDeployment: { Enabled: true, RetainStacksOnAccountRemoval: false },
    ManagedExecution: { Active: true },
    Tags: [{ Key: "AppManagerCFNStackKey", Value: stackName }],
  });
  await cloudformation.createStackInstances({
    StackSetName: stackName,
    Regions: regions,
    DeploymentTargets: {
      OrganizationalUnitIds: organizationalUnitIds,
      Accounts: suspendedAccounts,
      AccountFilterType: "DIFFERENCE",
    },
    OperationPreferences: {
      MaxConcurrentCount: failureToleranceCount + 1,
      FailureToleranceCount: failureToleranceCount,
      RegionConcurrencyType: "PARALLEL",
    },
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
  await cloudformation.deleteStackInstances({
    StackSetName: stackName,
    Regions: regions,
    RetainStacks: false,
    DeploymentTargets: {
      OrganizationalUnitIds: organizationalUnitIds,
      Accounts: suspendedAccounts,
      AccountFilterType: "DIFFERENCE",
    },
    OperationPreferences: {
      MaxConcurrentCount: failureToleranceCount + 1,
      FailureToleranceCount: failureToleranceCount,
      RegionConcurrencyType: "PARALLEL",
    },
  });
  for (const _ of Array(maxRetry)) {
    try {
      await cloudformation.deleteStackSet({ StackSetName: stackName });
      break;
    } catch (error: any) {
      if (error.name === "OperationInProgressException") {
        await sleep(interval);
      } else {
        throw error;
      }
    }
  }
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
    {} as Record<string, string>,
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
    Tags: [{ Key: "AppManagerCFNStackKey", Value: stackName }],
  });
  return JSON.stringify(stackName, null, 2);
}

async function updateStackSet() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = await readFile(templatePath, "utf8");
  await cloudformation.updateStackSet({
    StackSetName: stackName,
    TemplateBody: templateBody,
    Regions: regions,
    DeploymentTargets: {
      OrganizationalUnitIds: organizationalUnitIds,
      Accounts: suspendedAccounts,
      AccountFilterType: "DIFFERENCE",
    },
    OperationPreferences: {
      MaxConcurrentCount: failureToleranceCount + 1,
      FailureToleranceCount: failureToleranceCount,
      RegionConcurrencyType: "PARALLEL",
    },
    Capabilities: ["CAPABILITY_AUTO_EXPAND", "CAPABILITY_NAMED_IAM"],
    Tags: [{ Key: "AppManagerCFNStackKey", Value: stackName }],
  });
  return JSON.stringify(stackName, null, 2);
}

async function validateTemplate() {
  const cloudformation = new CloudFormationWrapper();
  const templateBody = await readFile(templatePath, "utf8");
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
  updateStackSet,
  validateTemplate,
};

export default actions;
