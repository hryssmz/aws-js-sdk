// ec2/actions.ts
import { chmod, rm, writeFile } from "node:fs/promises";
import { NodeSSH } from "node-ssh";
import { EC2Wrapper } from ".";
import type { Instance } from "@aws-sdk/client-ec2";
import type { Action } from "../utils";

const keyPairName = "my-key-pair";
const keyPairPath = `${__dirname}/../../${keyPairName}.pem`;
const sgName = "my-security-group";
const imageId = "ami-0de5311b2a443fb89";
const ipIngress = [
  {
    FromPort: 22,
    ToPort: 22,
    IpProtocol: "tcp",
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
];
const ec2User = "ec2-user";

async function connectInstance() {
  const ec2 = new EC2Wrapper();
  const ssh = new NodeSSH();
  const instances = await ec2.listInstances(keyPairName, sgName);
  const instance = instances[0];
  const publicIp = instance.PublicIpAddress;
  const result = await ssh
    .connect({
      host: publicIp,
      username: ec2User,
      privateKeyPath: keyPairPath,
    })
    .then(() => ssh.exec("hostname", []))
    .finally(() => ssh.dispose());
  console.log(new Date());
  return JSON.stringify(result, null, 2);
}

async function createKeyPair() {
  const ec2 = new EC2Wrapper();
  const { KeyMaterial } = await ec2.createKeyPair({ KeyName: keyPairName });
  if (KeyMaterial !== undefined) {
    await writeFile(keyPairPath, KeyMaterial);
    await chmod(keyPairPath, 0o400);
  }
  return JSON.stringify(keyPairName, null, 2);
}

async function createSecurityGroup() {
  const ec2 = new EC2Wrapper();
  await ec2.createSecurityGroup({
    GroupName: sgName,
    Description: "My security group",
  });
  return JSON.stringify(sgName, null, 2);
}

async function createSecurityRules() {
  const ec2 = new EC2Wrapper();
  const { SecurityGroupRules } = await ec2.authorizeSecurityGroupIngress({
    GroupName: sgName,
    IpPermissions: ipIngress,
  });
  return JSON.stringify(SecurityGroupRules, null, 2);
}

async function deleteKeyPair() {
  const ec2 = new EC2Wrapper();
  await ec2.deleteKeyPair({ KeyName: keyPairName });
  await rm(keyPairPath, { force: true });
  return JSON.stringify(keyPairName, null, 2);
}

async function deleteSecurityGroup() {
  const ec2 = new EC2Wrapper();
  await ec2.deleteSecurityGroup({ GroupName: sgName });
  return JSON.stringify(sgName, null, 2);
}

async function deleteSecurityRules() {
  const ec2 = new EC2Wrapper();
  await ec2.revokeSecurityGroupIngress({
    GroupName: sgName,
    IpPermissions: ipIngress,
  });
  await ec2.deleteAllSecurityGroupRules(sgName);
  return JSON.stringify(sgName, null, 2);
}

async function listInstances() {
  const ec2 = new EC2Wrapper();
  const { Reservations } = await ec2.describeInstances({});
  const instances =
    Reservations?.reduce(
      (acc, { Instances }) => [...acc, ...(Instances ?? [])],
      [] as Instance[]
    ) ?? [];
  const results = instances
    .map(({ InstanceId, State, PublicIpAddress }) => ({
      InstanceId,
      State: State?.Name,
      PublicIpAddress,
    }))
    .filter(({ State }) => State !== "terminated");
  return JSON.stringify(results, null, 2);
}

async function runInstance() {
  const ec2 = new EC2Wrapper();
  const { Instances } = await ec2.runInstances({
    MaxCount: 1,
    MinCount: 1,
    ImageId: imageId,
    KeyName: keyPairName,
    InstanceType: "t2.micro",
    SecurityGroups: [sgName],
  });
  const results = Instances?.map(
    ({ ImageId, InstanceId, KeyName, PrivateDnsName }) => ({
      ImageId,
      InstanceId,
      KeyName,
      PrivateDnsName,
    })
  );
  return JSON.stringify(results, null, 2);
}

async function startInstances() {
  const ec2 = new EC2Wrapper();
  const instances = await ec2.listInstances(keyPairName, sgName);
  const InstanceIds = instances.map(({ InstanceId }) => InstanceId ?? "");
  await ec2.startInstances({ InstanceIds });
  return JSON.stringify(InstanceIds, null, 2);
}

async function stopInstances() {
  const ec2 = new EC2Wrapper();
  const instances = await ec2.listInstances(keyPairName, sgName);
  const InstanceIds = instances.map(({ InstanceId }) => InstanceId ?? "");
  await ec2.stopInstances({ InstanceIds });
  return JSON.stringify(InstanceIds, null, 2);
}

async function termInstances() {
  const ec2 = new EC2Wrapper();
  const instances = await ec2.listInstances(keyPairName, sgName);
  const InstanceIds = instances.map(({ InstanceId }) => InstanceId ?? "");
  await ec2.terminateInstances({ InstanceIds });
  return JSON.stringify(InstanceIds, null, 2);
}

const actions: Record<string, Action> = {
  connectInstance,
  createKeyPair,
  createSecurityGroup,
  createSecurityRules,
  deleteKeyPair,
  deleteSecurityGroup,
  deleteSecurityRules,
  listInstances,
  runInstance,
  startInstances,
  stopInstances,
  termInstances,
};

export default actions;
