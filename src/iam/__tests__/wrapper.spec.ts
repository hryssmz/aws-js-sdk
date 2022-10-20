// iam/__tests__/wrapper.spec.ts
import { IAMWrapper } from "../wrapper";
import { accountAlias, isLocal } from "./utils";
import {
  groupName,
  managedPolicyJson,
  policyArn,
  policyName,
  roleName,
  trustPolicyJson,
  userName,
} from "./dummy";

jest.setTimeout((isLocal ? 5 : 30) * 1000);

const iam = new IAMWrapper();

describe("Group APIs", () => {
  beforeEach(async () => {
    await iam.deleteGroupsByPrefix(groupName);
  });

  afterAll(async () => {
    await iam.deleteGroupsByPrefix(groupName);
  });

  const getNumberOfGroups = async () => {
    const { Groups } = await iam.listGroups({});
    return Groups?.length ?? 0;
  };

  test("Create, get, list, and delete group", async () => {
    const numberOfGroups = await getNumberOfGroups();
    const { Group: group1 } = await iam.createGroup({ GroupName: groupName });

    expect(await getNumberOfGroups()).toBe(numberOfGroups + 1);
    expect(group1?.GroupName).toBe(groupName);

    const { Group: group2 } = await iam.getGroup({ GroupName: groupName });

    expect(group2?.GroupId).toBe(group2?.GroupId);

    await iam.deleteGroup({ GroupName: groupName });

    expect(await getNumberOfGroups()).toBe(numberOfGroups);
  });

  test("deleteGroupsByPrefix() helper", async () => {
    const numberOfGroups = await getNumberOfGroups();
    await iam.createGroup({ GroupName: groupName });

    expect(await getNumberOfGroups()).toBe(numberOfGroups + 1);

    await iam.deleteGroupsByPrefix(groupName);

    expect(await getNumberOfGroups()).toBe(numberOfGroups);
  });
});

describe("Policy APIs", () => {
  beforeEach(async () => {
    await iam.deletePoliciesByPrefix(policyName);
  });

  afterAll(async () => {
    await iam.deletePoliciesByPrefix(policyName);
  });

  const getNumberOfPolicies = async () => {
    const { Policies } = await iam.listPolicies({ Scope: "Local" });
    return Policies?.length ?? 0;
  };

  test("Create, get, list, and delete policy", async () => {
    const numberOfPolicies = await getNumberOfPolicies();
    const { Policy: policy1 } = await iam.createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });

    expect(await getNumberOfPolicies()).toBe(numberOfPolicies + 1);
    expect(policy1?.PolicyName).toBe(policyName);

    const { Policy: policy2 } = await iam.getPolicy({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      PolicyArn: policy1!.Arn,
    });

    expect(policy2?.PolicyId).toBe(policy1?.PolicyId);

    await iam.deletePolicy({ PolicyArn: policy1?.Arn });

    expect(await getNumberOfPolicies()).toBe(numberOfPolicies);
  });

  test("deletePoliciesByPrefix() helper", async () => {
    const numberOfPolicies = await getNumberOfPolicies();
    await iam.createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });

    expect(await getNumberOfPolicies()).toBe(numberOfPolicies + 1);

    await iam.deletePoliciesByPrefix(policyName);

    expect(await getNumberOfPolicies()).toBe(numberOfPolicies);
  });
});

describe("Policy version APIs", () => {
  const managedPolicy2Json = {
    ...managedPolicyJson,
    Statement: [
      {
        ...managedPolicyJson.Statement[0],
        Action: ["s3:GetObject", "s3:PutObject"],
      },
    ],
  };

  beforeEach(async () => {
    await iam.deletePoliciesByPrefix(policyName);
  });

  afterAll(async () => {
    await iam.deletePoliciesByPrefix(policyName);
  });

  const getNumberOfPolicyVersions = async (PolicyArn?: string) => {
    const { Versions } = await iam.listPolicyVersions({ PolicyArn });
    return Versions?.length ?? 0;
  };

  test("Create, get, list, and delete policy version", async () => {
    const { Policy } = await iam.createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(1);

    const { PolicyVersion: version1 } = await iam.createPolicyVersion({
      PolicyArn: Policy?.Arn,
      PolicyDocument: JSON.stringify(managedPolicy2Json),
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(2);

    const { PolicyVersion: version2 } = await iam.getPolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version1?.VersionId,
    });

    expect(
      JSON.parse(decodeURIComponent(version2?.Document ?? ""))
    ).toStrictEqual(managedPolicy2Json);

    await iam.deletePolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version2?.VersionId,
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(1);
  });

  test("Set policy default version", async () => {
    const { Policy } = await iam.createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });
    const { PolicyVersion: version1 } = await iam.createPolicyVersion({
      PolicyArn: Policy?.Arn,
      PolicyDocument: JSON.stringify(managedPolicy2Json),
    });
    await iam.setDefaultPolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version1?.VersionId,
    });
    const { PolicyVersion: version2 } = await iam.getPolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version1?.VersionId,
    });

    expect(version2?.IsDefaultVersion).toBe(true);
  });

  test("deleteAllPolicyVersions() helper", async () => {
    const { Policy } = await iam.createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });
    await iam.createPolicyVersion({
      PolicyArn: Policy?.Arn,
      PolicyDocument: JSON.stringify(managedPolicy2Json),
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(2);

    await iam.deleteAllPolicyVersions(Policy?.Arn);

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(1);
  });
});

describe("Role APIs", () => {
  beforeEach(async () => {
    await iam.deleteRolesByPrefix(roleName);
  });

  afterAll(async () => {
    await iam.deleteRolesByPrefix(roleName);
  });

  const getNumberOfRoles = async () => {
    const { Roles } = await iam.listRoles({});
    return Roles?.length ?? 0;
  };

  test("Create, get, list, and delete role", async () => {
    const numberOfRoles = await getNumberOfRoles();
    const { Role: role1 } = await iam.createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });

    expect(await getNumberOfRoles()).toBe(numberOfRoles + 1);
    expect(role1?.RoleName).toBe(roleName);

    const { Role: role2 } = await iam.getRole({ RoleName: roleName });

    expect(role2?.RoleId).toBe(role1?.RoleId);

    await iam.deleteRole({ RoleName: roleName });

    expect(await getNumberOfRoles()).toBe(numberOfRoles);
  });

  test("deleteRolesByPrefix() helper", async () => {
    const numberOfRoles = await getNumberOfRoles();
    await iam.createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });

    expect(await getNumberOfRoles()).toBe(numberOfRoles + 1);

    await iam.deleteRolesByPrefix(roleName);

    expect(await getNumberOfRoles()).toBe(numberOfRoles);
  });
});

describe("Role policy APIs", () => {
  beforeAll(async () => {
    await iam.deleteRolesByPrefix(roleName);
    await iam.createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });
  });

  beforeEach(async () => {
    await iam.detachAllRolePolicies(roleName);
  });

  afterAll(async () => {
    await iam.deleteRolesByPrefix(roleName);
  });

  const getNumberOfAttachedRolePolicies = async (RoleName?: string) => {
    const { AttachedPolicies } = await iam.listAttachedRolePolicies({
      RoleName,
    });
    return AttachedPolicies?.length ?? 0;
  };

  test("Attach, list, and detach policy to role", async () => {
    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(0);

    await iam.attachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(1);

    await iam.detachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(0);
  });

  test("detachAllRolePolicies() helper", async () => {
    await iam.attachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(1);

    await iam.detachAllRolePolicies(roleName);

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(0);
  });
});

describe("Role inline policy APIs", () => {
  beforeAll(async () => {
    await iam.deleteRolesByPrefix(roleName);
    await iam.createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });
  });

  beforeEach(async () => {
    await iam.deleteAllRolePolicies(roleName);
  });

  afterAll(async () => {
    await iam.deleteRolesByPrefix(roleName);
  });

  const getNumberOfRolePolicies = async (RoleName?: string) => {
    const { PolicyNames } = await iam.listRolePolicies({ RoleName });
    return PolicyNames?.length ?? 0;
  };

  test("Create, list, and delete inline role policy", async () => {
    expect(await getNumberOfRolePolicies(roleName)).toBe(0);

    await iam.putRolePolicy({
      RoleName: roleName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfRolePolicies(roleName)).toBe(1);

    await iam.deleteRolePolicy({ RoleName: roleName, PolicyName: policyName });

    expect(await getNumberOfRolePolicies(roleName)).toBe(0);
  });

  test("deleteAllRolePolicies() helper", async () => {
    await iam.putRolePolicy({
      RoleName: roleName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfRolePolicies(roleName)).toBe(1);

    await iam.deleteAllRolePolicies(roleName);

    expect(await getNumberOfRolePolicies(roleName)).toBe(0);
  });
});

describe("User APIs", () => {
  beforeEach(async () => {
    await iam.deleteUsersByPrefix(userName);
  });

  afterAll(async () => {
    await iam.deleteUsersByPrefix(userName);
  });

  const getNumberOfUsers = async () => {
    const { Users } = await iam.listUsers({});
    return Users?.length ?? 0;
  };

  test("Create, get, list, and delete user", async () => {
    const numberOfUsers = await getNumberOfUsers();
    const { User: user1 } = await iam.createUser({ UserName: userName });

    expect(await getNumberOfUsers()).toBe(numberOfUsers + 1);
    expect(user1?.UserName).toBe(userName);

    const { User: user2 } = await iam.getUser({ UserName: userName });

    expect(user2?.UserId).toBe(user1?.UserId);

    await iam.deleteUser({ UserName: userName });

    expect(await getNumberOfUsers()).toBe(numberOfUsers);
  });

  test("Update user", async () => {
    const oldUserName = "john_doe";
    await iam.createUser({ UserName: oldUserName });
    const { User: user1 } = await iam.getUser({ UserName: oldUserName });

    expect(user1?.UserName).toBe(oldUserName);

    await iam.updateUser({ UserName: oldUserName, NewUserName: userName });
    const { User: user2 } = await iam.getUser({ UserName: userName });

    expect(user2?.UserName).toBe(userName);
    expect(user2?.UserId).toBe(user1?.UserId);
  });

  test("deleteUsersByPrefix() helper", async () => {
    const numberOfUsers = await getNumberOfUsers();
    await iam.createUser({ UserName: userName });

    expect(await getNumberOfUsers()).toBe(numberOfUsers + 1);

    await iam.deleteUsersByPrefix(userName);

    expect(await getNumberOfUsers()).toBe(numberOfUsers);
  });
});

describe("Access keys APIs", () => {
  beforeAll(async () => {
    await iam.deleteUsersByPrefix(userName);
    await iam.createUser({ UserName: userName });
  });

  beforeEach(async () => {
    await iam.deleteAllUserAccessKeys(userName);
  });

  afterAll(async () => {
    await iam.deleteUsersByPrefix(userName);
  });

  const getNumberOfAccessKeys = async (UserName?: string) => {
    const { AccessKeyMetadata } = await iam.listAccessKeys({ UserName });
    return AccessKeyMetadata?.length ?? 0;
  };

  test("Create, list, and delete access key", async () => {
    expect(await getNumberOfAccessKeys(userName)).toBe(0);

    await iam.createAccessKey({ UserName: userName });

    expect(await getNumberOfAccessKeys(userName)).toBe(1);

    const { AccessKeyMetadata } = await iam.listAccessKeys({
      UserName: userName,
    });
    await iam.deleteAccessKey({
      UserName: userName,
      AccessKeyId: AccessKeyMetadata?.[0].AccessKeyId,
    });

    expect(await getNumberOfAccessKeys(userName)).toBe(0);
  });

  test("Get access key last used info", async () => {
    const { AccessKey } = await iam.createAccessKey({ UserName: userName });
    const { AccessKeyLastUsed } = await iam.getAccessKeyLastUsed({
      AccessKeyId: AccessKey?.AccessKeyId,
    });

    expect(AccessKeyLastUsed?.LastUsedDate).toBeUndefined();
    expect(AccessKeyLastUsed?.Region).toBe("N/A");
    expect(AccessKeyLastUsed?.ServiceName).toBe("N/A");
  });

  test("Deactivate access key", async () => {
    const getFirstAccessKeyStatus = async () => {
      const { AccessKeyMetadata } = await iam.listAccessKeys({
        UserName: userName,
      });
      const status = AccessKeyMetadata?.[0].Status;
      return status;
    };
    const { AccessKey } = await iam.createAccessKey({ UserName: userName });

    expect(await getFirstAccessKeyStatus()).toBe("Active");

    await iam.updateAccessKey({
      AccessKeyId: AccessKey?.AccessKeyId,
      UserName: userName,
      Status: "Inactive",
    });

    expect(await getFirstAccessKeyStatus()).toBe("Inactive");
  });

  test("deleteAllUserAccessKeys() helper", async () => {
    await iam.createAccessKey({ UserName: userName });

    expect(await getNumberOfAccessKeys(userName)).toBe(1);

    await iam.deleteAllUserAccessKeys(userName);

    expect(await getNumberOfAccessKeys(userName)).toBe(0);
  });
});

describe("User policy APIs", () => {
  beforeAll(async () => {
    await iam.deleteUsersByPrefix(userName);
    await iam.createUser({ UserName: userName });
  });

  beforeEach(async () => {
    await iam.detachAllUserPolicies(userName);
    await iam.deletePoliciesByPrefix(policyName);
  });

  afterAll(async () => {
    await iam.deleteUsersByPrefix(userName);
    await iam.deletePoliciesByPrefix(policyName);
  });

  const getNumberOfAttachedUserPolicies = async (UserName?: string) => {
    const { AttachedPolicies } = await iam.listAttachedUserPolicies({
      UserName,
    });
    return AttachedPolicies?.length ?? 0;
  };

  test("Attach, list, and detach policy to user", async () => {
    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(0);

    await iam.attachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(1);

    await iam.detachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(0);
  });

  test("detachAllUserPolicies() helper", async () => {
    await iam.attachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(1);

    await iam.detachAllUserPolicies(userName);

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(0);
  });
});

describe("User inline policy APIs", () => {
  beforeAll(async () => {
    await iam.deleteUsersByPrefix(userName);
    await iam.createUser({ UserName: userName });
  });

  beforeEach(async () => {
    await iam.deleteAllUserPolicies(userName);
  });

  afterAll(async () => {
    await iam.deleteUsersByPrefix(userName);
  });

  const getNumberOfUserPolicies = async (UserName?: string) => {
    const { PolicyNames } = await iam.listUserPolicies({ UserName });
    return PolicyNames?.length ?? 0;
  };

  test("Create, list, and delete inline user policy", async () => {
    expect(await getNumberOfUserPolicies(userName)).toBe(0);

    await iam.putUserPolicy({
      UserName: userName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfUserPolicies(userName)).toBe(1);

    await iam.deleteUserPolicy({ UserName: userName, PolicyName: policyName });

    expect(await getNumberOfUserPolicies(userName)).toBe(0);
  });

  test("deleteAllUserPolicies() helper", async () => {
    expect(await getNumberOfUserPolicies(userName)).toBe(0);

    await iam.putUserPolicy({
      UserName: userName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfUserPolicies(userName)).toBe(1);

    await iam.deleteAllUserPolicies(userName);

    expect(await getNumberOfUserPolicies(userName)).toBe(0);
  });
});

describe("Account alias APIs", () => {
  afterAll(async () => {
    await iam.createAccountAlias({ AccountAlias: accountAlias });
  });

  const getNumberOfAccountAliases = async () => {
    const { AccountAliases } = await iam.listAccountAliases({});
    return AccountAliases?.length ?? 0;
  };

  test("Create, list, and delete account alias", async () => {
    const alias2 = `${accountAlias}2`;
    await iam.createAccountAlias({ AccountAlias: alias2 });
    const { AccountAliases } = await iam.listAccountAliases({});

    expect(await getNumberOfAccountAliases()).toBe(1);
    expect(AccountAliases?.[0]).toBe(alias2);

    await iam.deleteAccountAlias({ AccountAlias: alias2 });

    expect(await getNumberOfAccountAliases()).toBe(0);
  });
});

describe("Account summary APIs", () => {
  beforeAll(async () => {
    await iam.deleteUsersByPrefix(userName);
    await iam.createUser({ UserName: userName });
  });

  afterAll(async () => {
    await iam.deleteUsersByPrefix(userName);
  });

  test("Generate and get credentials report", async () => {
    await iam.createAccessKey({ UserName: userName });
    await iam.generateCredentialReport({});
    const { Content } = await iam.getCredentialReport({});
    const [header, ...body] = Buffer.from(Content ?? [])
      .toString()
      .trimEnd()
      .split("\n")
      .map(row => row.split(","));

    expect(header[0]).toBe("user");
    expect(body.findIndex(row => row[0] === userName)).toBeGreaterThan(-1);
  });

  test("Get account summary", async () => {
    const { SummaryMap } = await iam.getAccountSummary({});

    expect(SummaryMap?.Groups).toBeGreaterThanOrEqual(0);
    expect(SummaryMap?.Users).toBeGreaterThanOrEqual(1);
  });

  test("Get account authorization details", async () => {
    const { UserDetailList, Policies } =
      await iam.getAccountAuthorizationDetails({});

    expect(
      UserDetailList?.findIndex(({ UserName }) => UserName === userName)
    ).toBeGreaterThan(-1);
    expect(
      Policies?.findIndex(
        ({ PolicyName }) => PolicyName === "AdministratorAccess"
      )
    ).toBeGreaterThan(-1);
  });
});
