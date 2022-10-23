// ec2/__tests__/legacy.spec.ts
import { writeFile } from "node:fs/promises";
import { NodeSSH } from "node-ssh";
import {
  authorizeSecurityGroupIngress,
  createKeyPair,
  createSecurityGroup,
  deleteAllInstances,
  deleteAllSecurityGroupRules,
  deleteKeyPair,
  deleteSecurityGroup,
  deleteSecurityGroupsByPrefix,
  describeKeyPairs,
  describeSecurityGroups,
  getKeyPairByName,
  getSecurityGroupByName,
  listInstances,
  listSecurityGroupRules,
  revokeSecurityGroupIngress,
  runInstances,
  startInstances,
  stopInstances,
  terminateInstances,
} from "../legacy";
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

describe("Key pair APIs", () => {
  beforeEach(async () => {
    await deleteKeyPair({ KeyName: keyPairName });
  });

  afterAll(async () => {
    await deleteKeyPair({ KeyName: keyPairName });
  });

  const getNumberOfKeyPairs = async () => {
    const { KeyPairs } = await describeKeyPairs({});
    return KeyPairs?.length ?? 0;
  };

  test("Create, list, and delete key pair", async () => {
    const numberOfKeyPairs = await getNumberOfKeyPairs();
    const { KeyPairId } = await createKeyPair({ KeyName: keyPairName });

    expect(await getNumberOfKeyPairs()).toBe(numberOfKeyPairs + 1);

    const keyPair = await describeKeyPairs({ KeyNames: [keyPairName] }).then(
      ({ KeyPairs }) => KeyPairs?.[0]
    );

    expect(keyPair?.KeyPairId).toBe(KeyPairId);

    await deleteKeyPair({ KeyName: keyPairName });

    expect(await getNumberOfKeyPairs()).toBe(numberOfKeyPairs);
  });

  test("getKeyPairByName() helper", async () => {
    const { KeyPairId } = await createKeyPair({ KeyName: keyPairName });
    const keyPair = await getKeyPairByName(keyPairName);

    expect(keyPair?.KeyPairId).toBe(KeyPairId);
  });
});

describe("Security group APIs", () => {
  beforeEach(async () => {
    await deleteSecurityGroupsByPrefix(sgName);
  });

  afterAll(async () => {
    await deleteSecurityGroupsByPrefix(sgName);
  });

  const getNumberOfSecurityGroup = async () => {
    const { SecurityGroups } = await describeSecurityGroups({});
    return SecurityGroups?.length ?? 0;
  };

  test("Create, list, and delete security group", async () => {
    const numberOfSecurityGroups = await getNumberOfSecurityGroup();
    const { GroupId } = await createSecurityGroup({
      GroupName: sgName,
      Description: sgDesc,
    });

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups + 1);

    const group = await describeSecurityGroups({ GroupNames: [sgName] }).then(
      ({ SecurityGroups }) => SecurityGroups?.[0]
    );

    expect(group?.GroupId).toBe(GroupId);

    await deleteSecurityGroup({ GroupName: sgName });

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups);
  });

  test("deleteSecurityGroupsByPrefix() helper", async () => {
    const numberOfSecurityGroups = await getNumberOfSecurityGroup();
    await createSecurityGroup({
      GroupName: sgName,
      Description: sgDesc,
    });

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups + 1);

    await deleteSecurityGroupsByPrefix(sgName);

    expect(await getNumberOfSecurityGroup()).toBe(numberOfSecurityGroups);
  });

  test("getSecurityGroupByName() helper", async () => {
    const { GroupId } = await createSecurityGroup({
      GroupName: sgName,
      Description: sgDesc,
    });
    const group = await getSecurityGroupByName(sgName);

    expect(group.GroupId).toBe(GroupId);
  });
});

describe("Security group inbound rule APIs", () => {
  beforeAll(async () => {
    await deleteSecurityGroupsByPrefix(sgName);
    await createSecurityGroup({ GroupName: sgName, Description: sgDesc });
  });

  beforeEach(async () => {
    await deleteAllSecurityGroupRules(sgName);
  });

  afterAll(async () => {
    await deleteSecurityGroupsByPrefix(sgName);
  });

  const getNumberOfInboundRules = async (name: string) => {
    const rules = await listSecurityGroupRules(name);
    return rules.length ?? 0;
  };

  test("Create, list, and delete inbound rule", async () => {
    expect(await getNumberOfInboundRules(sgName)).toBe(0);

    await authorizeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });

    expect(await getNumberOfInboundRules(sgName)).toBe(1);

    await revokeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });

    expect(await getNumberOfInboundRules(sgName)).toBe(0);
  });

  test("deleteAllSecurityGroupRules(), listSecurityGroupRules() helper", async () => {
    await authorizeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });

    expect(await getNumberOfInboundRules(sgName)).toBe(1);

    await deleteAllSecurityGroupRules(sgName);

    expect(await getNumberOfInboundRules(sgName)).toBe(0);
  });
});

describe("Instance APIs", () => {
  beforeAll(async () => {
    await deleteKeyPair({ KeyName: keyPairName });
    const instances = await deleteAllInstances(keyPairName, sgName);
    if (instances !== undefined) {
      await sleep(termInstanceSec);
    }
    await deleteSecurityGroupsByPrefix(sgName);
    const { KeyMaterial } = await createKeyPair({ KeyName: keyPairName });
    await writeFile(keyPairPath, KeyMaterial ?? "");
    await createSecurityGroup({ GroupName: sgName, Description: sgDesc });
    await authorizeSecurityGroupIngress({
      GroupName: sgName,
      IpPermissions: ipPermissions,
    });
  });

  beforeEach(async () => {
    const instances = await deleteAllInstances(keyPairName, sgName);
    if (instances !== undefined) {
      await sleep(termInstanceSec);
    }
  });

  afterAll(async () => {
    const instances = await deleteAllInstances(keyPairName, sgName);
    if (instances !== undefined) {
      await sleep(termInstanceSec);
    }
    await deleteKeyPair({ KeyName: keyPairName });
    await deleteSecurityGroupsByPrefix(sgName);
  });

  const getNumberOfInstances = async (keyName: string, groupName: string) => {
    const Instances = await listInstances(keyName, groupName);
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

    await runInstances({
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
    } = await listInstances(keyPairName, sgName).then(
      instances => instances[0]
    );
    const InstanceIds = [InstanceId ?? ""];

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(1);
    expect(await remoteExec(ip1 ?? "", "hostname", [])).toBe(PrivateDnsName);

    await stopInstances({ InstanceIds });
    await sleep(stopInstanceSec);

    await expect(remoteExec(ip1 ?? "", "hostname", [])).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Timed out while waiting for handshake",
      })
    );

    await startInstances({ InstanceIds });
    await sleep(startInstanceSec);
    const { PublicIpAddress: ip2 } = await listInstances(
      keyPairName,
      sgName
    ).then(instances => instances[0]);

    expect(await remoteExec(ip2 ?? "", "hostname", [])).toBe(PrivateDnsName);

    await terminateInstances({ InstanceIds });
    await sleep(termInstanceSec);

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(0);
  });

  test("deleteAllInstances(), listInstances() helper", async () => {
    await runInstances({
      MaxCount: 1,
      MinCount: 1,
      ImageId: "ami-0de5311b2a443fb89",
      KeyName: keyPairName,
      InstanceType: "t2.micro",
      SecurityGroups: [sgName],
    });
    await sleep(runInstanceSec);
    await listInstances(keyPairName, sgName).then(instances => instances[0]);

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(1);

    await deleteAllInstances(keyPairName, sgName);
    await sleep(termInstanceSec);

    expect(await getNumberOfInstances(keyPairName, sgName)).toBe(0);
    expect(await deleteAllInstances(keyPairName, sgName)).toBeUndefined();
  });
});
