// iam/__tests__/legacy.spec.ts
import {
  attachRolePolicy,
  attachUserPolicy,
  createAccessKey,
  createAccountAlias,
  createGroup,
  createPolicy,
  createPolicyVersion,
  createRole,
  createUser,
  deleteAccessKey,
  deleteAccountAlias,
  deleteAllPolicyVersions,
  deleteAllRolePolicies,
  deleteAllUserAccessKeys,
  deleteAllUserPolicies,
  deleteGroup,
  deleteGroupsByPrefix,
  deletePoliciesByPrefix,
  deletePolicy,
  deletePolicyVersion,
  deleteRole,
  deleteRolePolicy,
  deleteRolesByPrefix,
  deleteUser,
  deleteUserPolicy,
  deleteUsersByPrefix,
  detachAllRolePolicies,
  detachAllUserPolicies,
  detachRolePolicy,
  detachUserPolicy,
  generateCredentialReport,
  getAccessKeyLastUsed,
  getAccountAuthorizationDetails,
  getAccountSummary,
  getCredentialReport,
  getGroup,
  getPolicy,
  getPolicyVersion,
  getRole,
  getUser,
  listAccessKeys,
  listAccountAliases,
  listAttachedRolePolicies,
  listAttachedUserPolicies,
  listGroups,
  listPolicies,
  listPolicyVersions,
  listRolePolicies,
  listRoles,
  listUserPolicies,
  listUsers,
  putRolePolicy,
  putUserPolicy,
  setDefaultPolicyVersion,
  updateAccessKey,
  updateUser,
} from "../legacy";
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

describe("Group APIs", () => {
  beforeEach(async () => {
    await deleteGroupsByPrefix(groupName);
  });

  afterAll(async () => {
    await deleteGroupsByPrefix(groupName);
  });

  const getNumberOfGroups = async () => {
    const { Groups } = await listGroups({});
    return Groups?.length ?? 0;
  };

  test("Create, get, list, and delete group", async () => {
    const numberOfGroups = await getNumberOfGroups();
    const { Group: group1 } = await createGroup({ GroupName: groupName });

    expect(await getNumberOfGroups()).toBe(numberOfGroups + 1);
    expect(group1?.GroupName).toBe(groupName);

    const { Group: group2 } = await getGroup({ GroupName: groupName });

    expect(group2?.GroupId).toBe(group2?.GroupId);

    await deleteGroup({ GroupName: groupName });

    expect(await getNumberOfGroups()).toBe(numberOfGroups);
  });

  test("deleteGroupsByPrefix() helper", async () => {
    const numberOfGroups = await getNumberOfGroups();
    await createGroup({ GroupName: groupName });

    expect(await getNumberOfGroups()).toBe(numberOfGroups + 1);

    await deleteGroupsByPrefix(groupName);

    expect(await getNumberOfGroups()).toBe(numberOfGroups);
  });
});

describe("Policy APIs", () => {
  beforeEach(async () => {
    await deletePoliciesByPrefix(policyName);
  });

  afterAll(async () => {
    await deletePoliciesByPrefix(policyName);
  });

  const getNumberOfPolicies = async () => {
    const { Policies } = await listPolicies({ Scope: "Local" });
    return Policies?.length ?? 0;
  };

  test("Create, get, list, and delete policy", async () => {
    const numberOfPolicies = await getNumberOfPolicies();
    const { Policy: policy1 } = await createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });

    expect(await getNumberOfPolicies()).toBe(numberOfPolicies + 1);
    expect(policy1?.PolicyName).toBe(policyName);

    const { Policy: policy2 } = await getPolicy({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      PolicyArn: policy1!.Arn,
    });

    expect(policy2?.PolicyId).toBe(policy1?.PolicyId);

    await deletePolicy({ PolicyArn: policy1?.Arn });

    expect(await getNumberOfPolicies()).toBe(numberOfPolicies);
  });

  test("deletePoliciesByPrefix() helper", async () => {
    const numberOfPolicies = await getNumberOfPolicies();
    await createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });

    expect(await getNumberOfPolicies()).toBe(numberOfPolicies + 1);

    await deletePoliciesByPrefix(policyName);

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
    await deletePoliciesByPrefix(policyName);
  });

  afterAll(async () => {
    await deletePoliciesByPrefix(policyName);
  });

  const getNumberOfPolicyVersions = async (PolicyArn?: string) => {
    const { Versions } = await listPolicyVersions({ PolicyArn });
    return Versions?.length ?? 0;
  };

  test("Create, get, list, and delete policy version", async () => {
    const { Policy } = await createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(1);

    const { PolicyVersion: version1 } = await createPolicyVersion({
      PolicyArn: Policy?.Arn,
      PolicyDocument: JSON.stringify(managedPolicy2Json),
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(2);

    const { PolicyVersion: version2 } = await getPolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version1?.VersionId,
    });

    expect(
      JSON.parse(decodeURIComponent(version2?.Document ?? ""))
    ).toStrictEqual(managedPolicy2Json);

    await deletePolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version2?.VersionId,
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(1);
  });

  test("Set policy default version", async () => {
    const { Policy } = await createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });
    const { PolicyVersion: version1 } = await createPolicyVersion({
      PolicyArn: Policy?.Arn,
      PolicyDocument: JSON.stringify(managedPolicy2Json),
    });
    await setDefaultPolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version1?.VersionId,
    });
    const { PolicyVersion: version2 } = await getPolicyVersion({
      PolicyArn: Policy?.Arn,
      VersionId: version1?.VersionId,
    });

    expect(version2?.IsDefaultVersion).toBe(true);
  });

  test("deleteAllPolicyVersions() helper", async () => {
    const { Policy } = await createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
    });
    await createPolicyVersion({
      PolicyArn: Policy?.Arn,
      PolicyDocument: JSON.stringify(managedPolicy2Json),
    });

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(2);

    await deleteAllPolicyVersions(Policy?.Arn);

    expect(await getNumberOfPolicyVersions(Policy?.Arn)).toBe(1);
  });
});

describe("Role APIs", () => {
  beforeEach(async () => {
    await deleteRolesByPrefix(roleName);
  });

  afterAll(async () => {
    await deleteRolesByPrefix(roleName);
  });

  const getNumberOfRoles = async () => {
    const { Roles } = await listRoles({});
    return Roles?.length ?? 0;
  };

  test("Create, get, list, and delete role", async () => {
    const numberOfRoles = await getNumberOfRoles();
    const { Role: role1 } = await createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });

    expect(await getNumberOfRoles()).toBe(numberOfRoles + 1);
    expect(role1?.RoleName).toBe(roleName);

    const { Role: role2 } = await getRole({ RoleName: roleName });

    expect(role2?.RoleId).toBe(role1?.RoleId);

    await deleteRole({ RoleName: roleName });

    expect(await getNumberOfRoles()).toBe(numberOfRoles);
  });

  test("deleteRolesByPrefix() helper", async () => {
    const numberOfRoles = await getNumberOfRoles();
    await createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });

    expect(await getNumberOfRoles()).toBe(numberOfRoles + 1);

    await deleteRolesByPrefix(roleName);

    expect(await getNumberOfRoles()).toBe(numberOfRoles);
  });
});

describe("Role policy APIs", () => {
  beforeAll(async () => {
    await deleteRolesByPrefix(roleName);
    await createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });
  });

  beforeEach(async () => {
    await detachAllRolePolicies(roleName);
  });

  afterAll(async () => {
    await deleteRolesByPrefix(roleName);
  });

  const getNumberOfAttachedRolePolicies = async (RoleName?: string) => {
    const { AttachedPolicies } = await listAttachedRolePolicies({
      RoleName,
    });
    return AttachedPolicies?.length ?? 0;
  };

  test("Attach, list, and detach policy to role", async () => {
    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(0);

    await attachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(1);

    await detachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(0);
  });

  test("detachAllRolePolicies() helper", async () => {
    await attachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(1);

    await detachAllRolePolicies(roleName);

    expect(await getNumberOfAttachedRolePolicies(roleName)).toBe(0);
  });
});

describe("Role inline policy APIs", () => {
  beforeAll(async () => {
    await deleteRolesByPrefix(roleName);
    await createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
    });
  });

  beforeEach(async () => {
    await deleteAllRolePolicies(roleName);
  });

  afterAll(async () => {
    await deleteRolesByPrefix(roleName);
  });

  const getNumberOfRolePolicies = async (RoleName?: string) => {
    const { PolicyNames } = await listRolePolicies({ RoleName });
    return PolicyNames?.length ?? 0;
  };

  test("Create, list, and delete inline role policy", async () => {
    expect(await getNumberOfRolePolicies(roleName)).toBe(0);

    await putRolePolicy({
      RoleName: roleName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfRolePolicies(roleName)).toBe(1);

    await deleteRolePolicy({ RoleName: roleName, PolicyName: policyName });

    expect(await getNumberOfRolePolicies(roleName)).toBe(0);
  });

  test("deleteAllRolePolicies() helper", async () => {
    await putRolePolicy({
      RoleName: roleName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfRolePolicies(roleName)).toBe(1);

    await deleteAllRolePolicies(roleName);

    expect(await getNumberOfRolePolicies(roleName)).toBe(0);
  });
});

describe("User APIs", () => {
  beforeEach(async () => {
    await deleteUsersByPrefix(userName);
  });

  afterAll(async () => {
    await deleteUsersByPrefix(userName);
  });

  const getNumberOfUsers = async () => {
    const { Users } = await listUsers({});
    return Users?.length ?? 0;
  };

  test("Create, get, list, and delete user", async () => {
    const numberOfUsers = await getNumberOfUsers();
    const { User: user1 } = await createUser({ UserName: userName });

    expect(await getNumberOfUsers()).toBe(numberOfUsers + 1);
    expect(user1?.UserName).toBe(userName);

    const { User: user2 } = await getUser({ UserName: userName });

    expect(user2?.UserId).toBe(user1?.UserId);

    await deleteUser({ UserName: userName });

    expect(await getNumberOfUsers()).toBe(numberOfUsers);
  });

  test("Update user", async () => {
    const oldUserName = "john_doe";
    await createUser({ UserName: oldUserName });
    const { User: user1 } = await getUser({ UserName: oldUserName });

    expect(user1?.UserName).toBe(oldUserName);

    await updateUser({ UserName: oldUserName, NewUserName: userName });
    const { User: user2 } = await getUser({ UserName: userName });

    expect(user2?.UserName).toBe(userName);
    expect(user2?.UserId).toBe(user1?.UserId);
  });

  test("deleteUsersByPrefix() helper", async () => {
    const numberOfUsers = await getNumberOfUsers();
    await createUser({ UserName: userName });

    expect(await getNumberOfUsers()).toBe(numberOfUsers + 1);

    await deleteUsersByPrefix(userName);

    expect(await getNumberOfUsers()).toBe(numberOfUsers);
  });
});

describe("Access keys APIs", () => {
  beforeAll(async () => {
    await deleteUsersByPrefix(userName);
    await createUser({ UserName: userName });
  });

  beforeEach(async () => {
    await deleteAllUserAccessKeys(userName);
  });

  afterAll(async () => {
    await deleteUsersByPrefix(userName);
  });

  const getNumberOfAccessKeys = async (UserName?: string) => {
    const { AccessKeyMetadata } = await listAccessKeys({ UserName });
    return AccessKeyMetadata?.length ?? 0;
  };

  test("Create, list, and delete access key", async () => {
    expect(await getNumberOfAccessKeys(userName)).toBe(0);

    await createAccessKey({ UserName: userName });

    expect(await getNumberOfAccessKeys(userName)).toBe(1);

    const { AccessKeyMetadata } = await listAccessKeys({ UserName: userName });
    await deleteAccessKey({
      UserName: userName,
      AccessKeyId: AccessKeyMetadata?.[0].AccessKeyId,
    });

    expect(await getNumberOfAccessKeys(userName)).toBe(0);
  });

  test("Get access key last used info", async () => {
    const { AccessKey } = await createAccessKey({ UserName: userName });
    const { AccessKeyLastUsed } = await getAccessKeyLastUsed({
      AccessKeyId: AccessKey?.AccessKeyId,
    });

    expect(AccessKeyLastUsed?.LastUsedDate).toBeUndefined();
    expect(AccessKeyLastUsed?.Region).toBe("N/A");
    expect(AccessKeyLastUsed?.ServiceName).toBe("N/A");
  });

  test("Deactivate access key", async () => {
    const getFirstAccessKeyStatus = async () => {
      const { AccessKeyMetadata } = await listAccessKeys({
        UserName: userName,
      });
      const status = AccessKeyMetadata?.[0].Status;
      return status;
    };
    const { AccessKey } = await createAccessKey({ UserName: userName });

    expect(await getFirstAccessKeyStatus()).toBe("Active");

    await updateAccessKey({
      AccessKeyId: AccessKey?.AccessKeyId,
      UserName: userName,
      Status: "Inactive",
    });

    expect(await getFirstAccessKeyStatus()).toBe("Inactive");
  });

  test("deleteAllUserAccessKeys() helper", async () => {
    await createAccessKey({ UserName: userName });

    expect(await getNumberOfAccessKeys(userName)).toBe(1);

    await deleteAllUserAccessKeys(userName);

    expect(await getNumberOfAccessKeys(userName)).toBe(0);
  });
});

describe("User policy APIs", () => {
  beforeAll(async () => {
    await deleteUsersByPrefix(userName);
    await createUser({ UserName: userName });
  });

  beforeEach(async () => {
    await detachAllUserPolicies(userName);
    await deletePoliciesByPrefix(policyName);
  });

  afterAll(async () => {
    await deleteUsersByPrefix(userName);
    await deletePoliciesByPrefix(policyName);
  });

  const getNumberOfAttachedUserPolicies = async (UserName?: string) => {
    const { AttachedPolicies } = await listAttachedUserPolicies({
      UserName,
    });
    return AttachedPolicies?.length ?? 0;
  };

  test("Attach, list, and detach policy to user", async () => {
    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(0);

    await attachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(1);

    await detachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(0);
  });

  test("detachAllUserPolicies() helper", async () => {
    await attachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(1);

    await detachAllUserPolicies(userName);

    expect(await getNumberOfAttachedUserPolicies(userName)).toBe(0);
  });
});

describe("User inline policy APIs", () => {
  beforeAll(async () => {
    await deleteUsersByPrefix(userName);
    await createUser({ UserName: userName });
  });

  beforeEach(async () => {
    await deleteAllUserPolicies(userName);
  });

  afterAll(async () => {
    await deleteUsersByPrefix(userName);
  });

  const getNumberOfUserPolicies = async (UserName?: string) => {
    const { PolicyNames } = await listUserPolicies({ UserName });
    return PolicyNames?.length ?? 0;
  };

  test("Create, list, and delete inline user policy", async () => {
    expect(await getNumberOfUserPolicies(userName)).toBe(0);

    await putUserPolicy({
      UserName: userName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfUserPolicies(userName)).toBe(1);

    await deleteUserPolicy({ UserName: userName, PolicyName: policyName });

    expect(await getNumberOfUserPolicies(userName)).toBe(0);
  });

  test("deleteAllUserPolicies() helper", async () => {
    expect(await getNumberOfUserPolicies(userName)).toBe(0);

    await putUserPolicy({
      UserName: userName,
      PolicyDocument: JSON.stringify(managedPolicyJson),
      PolicyName: policyName,
    });

    expect(await getNumberOfUserPolicies(userName)).toBe(1);

    await deleteAllUserPolicies(userName);

    expect(await getNumberOfUserPolicies(userName)).toBe(0);
  });
});

describe("Account alias APIs", () => {
  afterAll(async () => {
    await createAccountAlias({ AccountAlias: accountAlias });
  });

  const getNumberOfAccountAliases = async () => {
    const { AccountAliases } = await listAccountAliases({});
    return AccountAliases?.length ?? 0;
  };

  test("Create, list, and delete account alias", async () => {
    const alias2 = `${accountAlias}2`;
    await createAccountAlias({ AccountAlias: alias2 });
    const { AccountAliases } = await listAccountAliases({});

    expect(await getNumberOfAccountAliases()).toBe(1);
    expect(AccountAliases?.[0]).toBe(alias2);

    await deleteAccountAlias({ AccountAlias: alias2 });

    expect(await getNumberOfAccountAliases()).toBe(0);
  });
});

describe("Account summary APIs", () => {
  beforeAll(async () => {
    await deleteUsersByPrefix(userName);
    await createUser({ UserName: userName });
  });

  afterAll(async () => {
    await deleteUsersByPrefix(userName);
  });

  test("Generate and get credentials report", async () => {
    await createAccessKey({ UserName: userName });
    await generateCredentialReport({});
    const { Content } = await getCredentialReport({});
    const [header, ...body] = Buffer.from(Content ?? [])
      .toString()
      .trimEnd()
      .split("\n")
      .map(row => row.split(","));

    expect(header[0]).toBe("user");
    expect(body.findIndex(row => row[0] === userName)).toBeGreaterThan(-1);
  });

  test("Get account summary", async () => {
    const { SummaryMap } = await getAccountSummary({});

    expect(SummaryMap?.Groups).toBeGreaterThanOrEqual(0);
    expect(SummaryMap?.Users).toBeGreaterThanOrEqual(1);
  });

  test("Get account authorization details", async () => {
    const { UserDetailList, Policies } = await getAccountAuthorizationDetails(
      {}
    );

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
