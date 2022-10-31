// ec2/index.ts
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

  async deleteAllSecurityGroupRules(GroupName: string) {
    const rules = await this.listSecurityGroupRules(GroupName);
    if (rules.length === 0) {
      return;
    }
    const SecurityGroupRuleIds =
      rules.map(({ SecurityGroupRuleId }) => SecurityGroupRuleId ?? "") ?? [];
    const result = await this.revokeSecurityGroupIngress({
      GroupName,
      SecurityGroupRuleIds,
    });
    return result;
  }

  async getKeyPairByName(name: string) {
    const keyPair = await this.describeKeyPairs({ KeyNames: [name] }).then(
      ({ KeyPairs }) => KeyPairs?.[0]
    );
    if (keyPair === undefined) {
      throw new Error();
    }
    return keyPair;
  }

  async getSecurityGroupByName(name: string) {
    const group = await this.describeSecurityGroups({
      GroupNames: [name],
    }).then(({ SecurityGroups }) => SecurityGroups?.[0]);
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
    const instances = Reservations[0].Instances ?? [];
    return instances;
  }

  async listSecurityGroupRules(name: string) {
    const { GroupId } = await this.getSecurityGroupByName(name);
    const { SecurityGroupRules } = await this.describeSecurityGroupRules({
      Filters: [{ Name: "group-id", Values: [GroupId ?? ""] }],
    });
    const results =
      SecurityGroupRules?.filter(({ IsEgress }) => !IsEgress) ?? [];
    return results;
  }
}
