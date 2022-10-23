// ec2/legacy.ts
import {
  AuthorizeSecurityGroupIngressCommand,
  CreateKeyPairCommand,
  CreateSecurityGroupCommand,
  DeleteKeyPairCommand,
  DeleteSecurityGroupCommand,
  DescribeInstancesCommand,
  DescribeKeyPairsCommand,
  DescribeSecurityGroupRulesCommand,
  DescribeSecurityGroupsCommand,
  EC2Client,
  RevokeSecurityGroupIngressCommand,
  RunInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
} from "@aws-sdk/client-ec2";
import { defaultEC2ClientConfig } from "./wrapper";
import type {
  AuthorizeSecurityGroupIngressCommandInput,
  CreateKeyPairCommandInput,
  CreateSecurityGroupCommandInput,
  DeleteKeyPairCommandInput,
  DeleteSecurityGroupCommandInput,
  DescribeInstancesCommandInput,
  DescribeKeyPairsCommandInput,
  DescribeSecurityGroupRulesCommandInput,
  DescribeSecurityGroupsCommandInput,
  EC2ClientConfig,
  RevokeSecurityGroupIngressCommandInput,
  RunInstancesCommandInput,
  StartInstancesCommandInput,
  StopInstancesCommandInput,
  TerminateInstancesCommandInput,
} from "@aws-sdk/client-ec2";

export const createEC2Client = (config?: EC2ClientConfig) => {
  return new EC2Client({ ...defaultEC2ClientConfig, ...config });
};

export const authorizeSecurityGroupIngress = async (
  params: AuthorizeSecurityGroupIngressCommandInput,
  client = createEC2Client()
) => {
  const command = new AuthorizeSecurityGroupIngressCommand(params);
  const result = await client.send(command);
  return result;
};

export const createKeyPair = async (
  params: CreateKeyPairCommandInput,
  client = createEC2Client()
) => {
  const command = new CreateKeyPairCommand(params);
  const result = await client.send(command);
  return result;
};

export const createSecurityGroup = async (
  params: CreateSecurityGroupCommandInput,
  client = createEC2Client()
) => {
  const command = new CreateSecurityGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteKeyPair = async (
  params: DeleteKeyPairCommandInput,
  client = createEC2Client()
) => {
  const command = new DeleteKeyPairCommand(params);
  const result = await client.send(command);
  return result;
};

export const describeSecurityGroupRules = async (
  params: DescribeSecurityGroupRulesCommandInput,
  client = createEC2Client()
) => {
  const command = new DescribeSecurityGroupRulesCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteSecurityGroup = async (
  params: DeleteSecurityGroupCommandInput,
  client = createEC2Client()
) => {
  const command = new DeleteSecurityGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const describeInstances = async (
  params: DescribeInstancesCommandInput,
  client = createEC2Client()
) => {
  const command = new DescribeInstancesCommand(params);
  const result = await client.send(command);
  return result;
};

export const describeKeyPairs = async (
  params: DescribeKeyPairsCommandInput,
  client = createEC2Client()
) => {
  const command = new DescribeKeyPairsCommand(params);
  const result = await client.send(command);
  return result;
};

export const describeSecurityGroups = async (
  params: DescribeSecurityGroupsCommandInput,
  client = createEC2Client()
) => {
  const command = new DescribeSecurityGroupsCommand(params);
  const result = await client.send(command);
  return result;
};

export const revokeSecurityGroupIngress = async (
  params: RevokeSecurityGroupIngressCommandInput,
  client = createEC2Client()
) => {
  const command = new RevokeSecurityGroupIngressCommand(params);
  const result = await client.send(command);
  return result;
};

export const runInstances = async (
  params: RunInstancesCommandInput,
  client = createEC2Client()
) => {
  const command = new RunInstancesCommand(params);
  const result = await client.send(command);
  return result;
};

export const startInstances = async (
  params: StartInstancesCommandInput,
  client = createEC2Client()
) => {
  const command = new StartInstancesCommand(params);
  const result = await client.send(command);
  return result;
};

export const stopInstances = async (
  params: StopInstancesCommandInput,
  client = createEC2Client()
) => {
  const command = new StopInstancesCommand(params);
  const result = await client.send(command);
  return result;
};

export const terminateInstances = async (
  params: TerminateInstancesCommandInput,
  client = createEC2Client()
) => {
  const command = new TerminateInstancesCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteSecurityGroupsByPrefix = async (
  prefix: string,
  client = createEC2Client()
) => {
  const { SecurityGroups } = await describeSecurityGroups({}, client);
  const promises =
    SecurityGroups?.filter(({ GroupName }) =>
      GroupName?.startsWith(prefix)
    ).map(async ({ GroupId }) => {
      const result = await deleteSecurityGroup({ GroupId }, client);
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllSecurityGroupRules = async (
  GroupName: string,
  client = createEC2Client()
) => {
  const rules = await listSecurityGroupRules(GroupName, client);
  if (rules.length === 0) {
    return;
  }
  const SecurityGroupRuleIds =
    /* c8 ignore next */
    rules.map(({ SecurityGroupRuleId }) => SecurityGroupRuleId ?? "") ?? [];
  const result = await revokeSecurityGroupIngress(
    { GroupName, SecurityGroupRuleIds },
    client
  );
  return result;
};

export const deleteAllInstances = async (
  keyName: string,
  groupName: string,
  client = createEC2Client()
) => {
  const instances = await listInstances(keyName, groupName, client);
  if (instances.length === 0) {
    return;
  }
  /* c8 ignore next */
  const InstanceIds = instances.map(({ InstanceId }) => InstanceId ?? "");
  const results = terminateInstances({ InstanceIds });
  return results;
};

export const getKeyPairByName = async (
  name: string,
  client = createEC2Client()
) => {
  const keyPair = await describeKeyPairs({ KeyNames: [name] }, client).then(
    ({ KeyPairs }) => KeyPairs?.[0]
  );
  /* c8 ignore next 3 */
  if (keyPair === undefined) {
    throw new Error();
  }
  return keyPair;
};

export const getSecurityGroupByName = async (
  name: string,
  client = createEC2Client()
) => {
  const group = await describeSecurityGroups(
    { GroupNames: [name] },
    client
  ).then(({ SecurityGroups }) => SecurityGroups?.[0]);
  /* c8 ignore next 3 */
  if (group === undefined) {
    throw new Error();
  }
  return group;
};

export const listInstances = async (
  keyName: string,
  groupName: string,
  client = createEC2Client()
) => {
  const { Reservations } = await describeInstances(
    {
      Filters: [
        { Name: "key-name", Values: [keyName] },
        { Name: "network-interface.group-name", Values: [groupName] },
      ],
    },
    client
  );
  if (Reservations === undefined || Reservations.length === 0) {
    return [];
  }
  /* c8 ignore next */
  const instances = Reservations[0].Instances ?? [];
  return instances;
};

export const listSecurityGroupRules = async (
  name: string,
  client = createEC2Client()
) => {
  const { GroupId } = await getSecurityGroupByName(name, client);
  const { SecurityGroupRules } = await describeSecurityGroupRules(
    /* c8 ignore next */
    { Filters: [{ Name: "group-id", Values: [GroupId ?? ""] }] },
    client
  );
  const results =
    /* c8 ignore next */
    SecurityGroupRules?.filter(({ IsEgress }) => !IsEgress) ?? [];
  return results;
};
