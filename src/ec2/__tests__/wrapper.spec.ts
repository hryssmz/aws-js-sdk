// ec2/__tests__/wrapper.spec.ts
import { writeFile } from "node:fs/promises";
import { NodeSSH } from "node-ssh";
import { EC2Wrapper } from "../wrapper";
import {
  ipPermissions,
  keyPairName,
  keyPairPath,
  runInstanceSec,
  sgDesc,
  sgName,
  startInstanceSec,
  stopInstanceSec,
  termInstanceSec,
} from "./dummy";
import { isLocal, sleep } from "./utils";

jest.setTimeout((isLocal ? 5 : 180) * 1000);

const ec2 = new EC2Wrapper();

describe("Key pair APIs", () => {
  beforeEach(async () => {
    await ec2.deleteKeyPair({ KeyName: keyPairName });
  });

  afterAll(async () => {
    await ec2.deleteKeyPair({ KeyName: keyPairName });
  });

  const getNumberOfKeyPairs = async () => {
    const { KeyPairs } = await ec2.describeKeyPairs({});
    return KeyPairs?.length ?? 0;
  };

  test("Create, list, and delete key pair", async () => {
    const numberOfKeyPairs = await getNumberOfKeyPairs();
    const { KeyPairId } = await ec2.createKeyPair({ KeyName: keyPairName });

    expect(await getNumberOfKeyPairs()).toBe(numberOfKeyPairs + 1);

    const keyPair = await ec2
      .describeKeyPairs({ KeyNames: [keyPairName] })
      .then(({ KeyPairs }) => KeyPairs?.[0]);

    expect(keyPair?.KeyPairId).toBe(KeyPairId);

    await ec2.deleteKeyPair({ KeyName: keyPairName });

    expect(await getNumberOfKeyPairs()).toBe(numberOfKeyPairs);
  });

  test("getKeyPairByName() helper", async () => {
    const { KeyPairId } = await ec2.createKeyPair({ KeyName: keyPairName });
    const keyPair = await ec2.getKeyPairByName(keyPairName);

    expect(keyPair?.KeyPairId).toBe(KeyPairId);
  });
});

describe("Security group APIs", () => {
  beforeEach(async () => {
    await ec2.deleteSecurityGroupsByPrefix(sgName);
  });

  afterAll(async () => {
    await ec2.deleteSecurityGroupsByPrefix(sgName);
  });

  const getNumberOfSecurityGroup = async () => {
    const { SecurityGroups } = await ec2.describeSecurityGroups({});
    return SecurityGroups?.length ?? 0;
  };

  test("Create, list, and delete security group", async () => {
    const numberOfSecurityGroups = await getNumberOfSecurityGroup();
    const { GroupId } = await ec2.createSecurityGroup({
      GroupName: sgName,
      Description: sgDesc,
    });

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups + 1);

    const group = await ec2
      .describeSecurityGroups({ GroupNames: [sgName] })
      .then(({ SecurityGroups }) => SecurityGroups?.[0]);

    expect(group?.GroupId).toBe(GroupId);

    await ec2.deleteSecurityGroup({ GroupName: sgName });

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups);
  });

  test("deleteSecurityGroupsByPrefix() helper", async () => {
    const numberOfSecurityGroups = await getNumberOfSecurityGroup();
    await ec2.createSecurityGroup({
      GroupName: sgName,
      Description: sgDesc,
    });

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups + 1);

    await ec2.deleteSecurityGroupsByPrefix(sgName);

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups);
  });

  test("getSecurityGroupByName() helper", async () => {
    const { GroupId } = await ec2.createSecurityGroup({
      GroupName: sgName,
      Description: sgDesc,
    });
    const group = await ec2.getSecurityGroupByName(sgName);

    expect(group.GroupId).toBe(GroupId);
  });
});

describe("Security group inbound rule APIs", () => {
  beforeAll(async () => {
    await ec2.deleteSecurityGroupsByPrefix(sgName);
    await ec2.createSecurityGroup({ GroupName: sgName, Description: sgDesc });
  });

  beforeEach(async () => {
    await ec2.deleteAllSecurityGroupRules(sgName);
  });

  afterAll(async () => {
    await ec2.deleteSecurityGroupsByPrefix(sgName);
  });

  const getNumberOfInboundRules = async (name: string) => {
    const rules = await ec2.listSecurityGroupRules(name);
    return rules.length ?? 0;
  };

  test("Create, list, and delete inbound rule", async () => {
    expect(await getNumberOfInboundRules(sgName)).toBe(0);

    await ec2.authorizeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });

    expect(await getNumberOfInboundRules(sgName)).toBe(1);

    await ec2.revokeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });

    expect(await getNumberOfInboundRules(sgName)).toBe(0);
  });

  test("deleteAllSecurityGroupRules(), listSecurityGroupRules() helper", async () => {
    await ec2.authorizeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });

    expect(await getNumberOfInboundRules(sgName)).toBe(1);

    await ec2.deleteAllSecurityGroupRules(sgName);

    expect(await getNumberOfInboundRules(sgName)).toBe(0);
  });
});

describe("Instance APIs", () => {
  beforeAll(async () => {
    await ec2.deleteKeyPair({ KeyName: keyPairName });
    const instances = await ec2.deleteAllInstances(keyPairName, sgName);
    if (instances !== undefined) {
      await sleep(termInstanceSec);
    }
    await ec2.deleteSecurityGroupsByPrefix(sgName);
    const { KeyMaterial } = await ec2.createKeyPair({ KeyName: keyPairName });
    await writeFile(keyPairPath, KeyMaterial ?? "");
    await ec2.createSecurityGroup({ GroupName: sgName, Description: sgDesc });
    await ec2.authorizeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });
  });

  beforeEach(async () => {
    const instances = await ec2.deleteAllInstances(keyPairName, sgName);
    if (instances !== undefined) {
      await sleep(termInstanceSec);
    }
  });

  afterAll(async () => {
    const instances = await ec2.deleteAllInstances(keyPairName, sgName);
    if (instances !== undefined) {
      await sleep(termInstanceSec);
    }
    await ec2.deleteKeyPair({ KeyName: keyPairName });
    await ec2.deleteSecurityGroupsByPrefix(sgName);
  });

  const getNumberOfInstances = async (keyName: string, groupName: string) => {
    const Instances = await ec2.listInstances(keyName, groupName);
    return Instances.length;
  };

  const remoteExec = async (host: string, cmd: string, params: string[]) => {
    const ssh = new NodeSSH();
    const stdout = await ssh
      .connect({ host, username: "ec2-user", privateKeyPath: keyPairPath })
      .then(() => ssh.exec(cmd, params))
      .finally(() => ssh.dispose);
    return stdout;
  };

  test("Run/Connect/Stop/Start/Reboot/Terminate instance", async () => {
    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(0);

    await ec2.runInstances({
      MaxCount: 1,
      MinCount: 1,
      ImageId: "ami-0de5311b2a443fb89",
      KeyName: keyPairName,
      InstanceType: "t2.micro",
      SecurityGroups: [sgName],
    });
    await sleep(runInstanceSec);
    const {
      PublicIpAddress: ip1,
      PrivateDnsName,
      InstanceId,
    } = await ec2
      .listInstances(keyPairName, sgName)
      .then(instances => instances[0]);
    const InstanceIds = [InstanceId ?? ""];

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(1);
    expect(await remoteExec(ip1 ?? "", "hostname", [])).toBe(PrivateDnsName);

    await ec2.stopInstances({ InstanceIds });
    await sleep(stopInstanceSec);

    await expect(remoteExec(ip1 ?? "", "hostname", [])).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Timed out while waiting for handshake",
      })
    );

    await ec2.startInstances({ InstanceIds });
    await sleep(startInstanceSec);
    const { PublicIpAddress: ip2 } = await ec2
      .listInstances(keyPairName, sgName)
      .then(instances => instances[0]);

    expect(await remoteExec(ip2 ?? "", "hostname", [])).toBe(PrivateDnsName);

    await ec2.terminateInstances({ InstanceIds });
    await sleep(termInstanceSec);

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(0);
  });

  test("deleteAllInstances(), listInstances() helper", async () => {
    await ec2.runInstances({
      MaxCount: 1,
      MinCount: 1,
      ImageId: "ami-0de5311b2a443fb89",
      KeyName: keyPairName,
      InstanceType: "t2.micro",
      SecurityGroups: [sgName],
    });
    await sleep(runInstanceSec);
    await ec2
      .listInstances(keyPairName, sgName)
      .then(instances => instances[0]);

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(1);

    await ec2.deleteAllInstances(keyPairName, sgName);
    await sleep(termInstanceSec);

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(0);
    expect(await ec2.deleteAllInstances(keyPairName, sgName)).toBeUndefined();
  });
});
