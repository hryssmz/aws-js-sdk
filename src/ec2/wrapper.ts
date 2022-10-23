// ec2/wrapper.ts
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
import { defaultClientConfig } from "../utils";
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

export const defaultEC2ClientConfig = {
  ...defaultClientConfig,
};

export class EC2Wrapper {
  client: EC2Client;

  constructor(config?: EC2ClientConfig) {
    this.client = new EC2Client({ ...defaultEC2ClientConfig, ...config });
  }

  async authorizeSecurityGroupIngress(
    params: AuthorizeSecurityGroupIngressCommandInput
  ) {
    const command = new AuthorizeSecurityGroupIngressCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createKeyPair(params: CreateKeyPairCommandInput) {
    const command = new CreateKeyPairCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createSecurityGroup(params: CreateSecurityGroupCommandInput) {
    const command = new CreateSecurityGroupCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteKeyPair(params: DeleteKeyPairCommandInput) {
    const command = new DeleteKeyPairCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteSecurityGroup(params: DeleteSecurityGroupCommandInput) {
    const command = new DeleteSecurityGroupCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async describeInstances(params: DescribeInstancesCommandInput) {
    const command = new DescribeInstancesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async describeKeyPairs(params: DescribeKeyPairsCommandInput) {
    const command = new DescribeKeyPairsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async describeSecurityGroupRules(
    params: DescribeSecurityGroupRulesCommandInput
  ) {
    const command = new DescribeSecurityGroupRulesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async describeSecurityGroups(params: DescribeSecurityGroupsCommandInput) {
    const command = new DescribeSecurityGroupsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async revokeSecurityGroupIngress(
    params: RevokeSecurityGroupIngressCommandInput
  ) {
    const command = new RevokeSecurityGroupIngressCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async runInstances(params: RunInstancesCommandInput) {
    const command = new RunInstancesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async startInstances(params: StartInstancesCommandInput) {
    const command = new StartInstancesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async stopInstances(params: StopInstancesCommandInput) {
    const command = new StopInstancesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async terminateInstances(params: TerminateInstancesCommandInput) {
    const command = new TerminateInstancesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteSecurityGroupsByPrefix(prefix: string) {
    const { SecurityGroups } = await this.describeSecurityGroups({});
    const promises =
      SecurityGroups?.filter(({ GroupName }) =>
        GroupName?.startsWith(prefix)
      ).map(async ({ GroupId }) => {
        const result = await this.deleteSecurityGroup({ GroupId });
        return result;
        /* c8 ignore next */
      }) ?? [];
    const results = await Promise.all(promises);
    return results;
  }

  async deleteAllSecurityGroupRules(GroupName: string) {
    const rules = await this.listSecurityGroupRules(GroupName);
    if (rules.length === 0) {
      return;
    }
    const SecurityGroupRuleIds =
      /* c8 ignore next */
      rules.map(({ SecurityGroupRuleId }) => SecurityGroupRuleId ?? "") ?? [];
    const result = await this.revokeSecurityGroupIngress({
      GroupName,
      SecurityGroupRuleIds,
    });
    return result;
  }

  async deleteAllInstances(keyName: string, groupName: string) {
    const instances = await this.listInstances(keyName, groupName);
    if (instances.length === 0) {
      return;
    }
    /* c8 ignore next */
    const InstanceIds = instances.map(({ InstanceId }) => InstanceId ?? "");
    const results = this.terminateInstances({ InstanceIds });
    return results;
  }

  async getKeyPairByName(name: string) {
    const keyPair = await this.describeKeyPairs({ KeyNames: [name] }).then(
      ({ KeyPairs }) => KeyPairs?.[0]
    );
    /* c8 ignore next 3 */
    if (keyPair === undefined) {
      throw new Error();
    }
    return keyPair;
  }

  async getSecurityGroupByName(name: string) {
    const group = await this.describeSecurityGroups({
      GroupNames: [name],
    }).then(({ SecurityGroups }) => SecurityGroups?.[0]);
    /* c8 ignore next 3 */
    if (group === undefined) {
      throw new Error();
    }
    return group;
  }

  async listInstances(keyName: string, groupName: string) {
    const { Reservations } = await this.describeInstances({
      Filters: [
        { Name: "key-name", Values: [keyName] },
        { Name: "network-interface.group-name", Values: [groupName] },
      ],
    });
    if (Reservations === undefined || Reservations.length === 0) {
      return [];
    }
    /* c8 ignore next */
    const instances = Reservations[0].Instances ?? [];
    return instances;
  }

  async listSecurityGroupRules(name: string) {
    const { GroupId } = await this.getSecurityGroupByName(name);
    const { SecurityGroupRules } = await this.describeSecurityGroupRules({
      /* c8 ignore next */
      Filters: [{ Name: "group-id", Values: [GroupId ?? ""] }],
    });
    const results =
      /* c8 ignore next */
      SecurityGroupRules?.filter(({ IsEgress }) => !IsEgress) ?? [];
    return results;
  }
}
