// iam/actions/__tests__/legacy.spec.ts
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
  deleteGroup,
  deletePolicy,
  deletePolicyVersion,
  deleteRole,
  deleteRolePolicy,
  deleteUser,
  deleteUserPolicy,
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
import {
  accountAlias,
  deleteAllUserAccessKeys,
  deleteGroupsByPath,
  deletePoliciesByPath,
  deleteRolesByPath,
  deleteUsersByPath,
  isLocal,
} from "./utils";
import {
  assumeRolePolicyJson,
  groupName,
  identityBasedPolicyJson,
  path,
  policyArn,
  policyName,
  roleName,
  rolePolicyName,
  userName,
  userPolicyName,
} from "./dummy";

jest.setTimeout((isLocal ? 5 : 30) * 1000);

describe("Group APIs", () => {
  beforeEach(async () => {
    await deleteGroupsByPath(path);
  });

  afterAll(async () => {
    await deleteGroupsByPath(path);
  });

  test("Create, get, list, and delete group", async () => {
    const listCurrentGroups = async () => {
      const { Groups: groups } = await listGroups({ PathPrefix: path });
      return groups;
    };

    expect(await listCurrentGroups()).toHaveLength(0);

    const { Group: group1 } = await createGroup({
      GroupName: groupName,
      Path: path,
    });

    expect(await listCurrentGroups()).toHaveLength(1);
    expect(group1?.GroupName).toBe(groupName);

    const { Group: group2 } = await getGroup({ GroupName: groupName });

    expect(group2?.GroupId).toBe(group2?.GroupId);

    await deleteGroup({ GroupName: groupName });

    expect(await listCurrentGroups()).toHaveLength(0);
  });
});

describe("Policy APIs", () => {
  beforeEach(async () => {
    await deletePoliciesByPath(path);
  });

  afterAll(async () => {
    await deletePoliciesByPath(path);
  });

  test("Create, get, list, and delete policy", async () => {
    const listCurrentPolicies = async () => {
      const { Policies: policies } = await listPolicies({ PathPrefix: path });
      return policies;
    };

    expect(await listCurrentPolicies()).toHaveLength(0);

    const { Policy: policy1 } = await createPolicy({
      PolicyName: policyName,
      PolicyDocument: JSON.stringify(identityBasedPolicyJson),
      Path: path,
    });

    expect(await listCurrentPolicies()).toHaveLength(1);
    expect(policy1?.PolicyName).toBe(policyName);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { Policy: policy2 } = await getPolicy({ PolicyArn: policy1!.Arn });

    expect(policy2?.PolicyId).toBe(policy1?.PolicyId);

    await deletePolicy({ PolicyArn: policy1?.Arn });

    expect(await listCurrentPolicies()).toHaveLength(0);
  });
});

describe("Policy version APIs", () => {
  const identityBasedPolicyV2Json = {
    ...identityBasedPolicyJson,
    Statement: [
      {
        ...identityBasedPolicyJson.Statement[0],
        Action: ["s3:GetObject", "s3:PutObject"],
      },
    ],
  };

  beforeEach(async () => {
    await deletePoliciesByPath(path);
  });

  afterAll(async () => {
    await deletePoliciesByPath(path);
  });

  test("Create, get, list, and delete policy version", async () => {
    const { Policy: policy } = await createPolicy({
      PolicyName: policyName,
      Path: path,
      PolicyDocument: JSON.stringify(identityBasedPolicyJson),
    });
    const listCurrentPolicyVersions = async () => {
      const { Versions: versions } = await listPolicyVersions({
        PolicyArn: policy?.Arn,
      });
      return versions;
    };

    expect(await listCurrentPolicyVersions()).toHaveLength(1);

    const { PolicyVersion: version1 } = await createPolicyVersion({
      PolicyArn: policy?.Arn,
      PolicyDocument: JSON.stringify(identityBasedPolicyV2Json),
    });

    expect(await listCurrentPolicyVersions()).toHaveLength(2);

    const { PolicyVersion: version2 } = await getPolicyVersion({
      PolicyArn: policy?.Arn,
      VersionId: version1?.VersionId,
    });

    expect(
      JSON.parse(decodeURIComponent(version2?.Document ?? ""))
    ).toStrictEqual(identityBasedPolicyV2Json);

    await deletePolicyVersion({
      PolicyArn: policy?.Arn,
      VersionId: version2?.VersionId,
    });

    expect(await listCurrentPolicyVersions()).toHaveLength(1);
  });

  test("Set policy default version", async () => {
    const { Policy: policy } = await createPolicy({
      PolicyName: policyName,
      Path: path,
      PolicyDocument: JSON.stringify(identityBasedPolicyJson),
    });
    const { PolicyVersion: version1 } = await createPolicyVersion({
      PolicyArn: policy?.Arn,
      PolicyDocument: JSON.stringify(identityBasedPolicyV2Json),
    });
    await setDefaultPolicyVersion({
      PolicyArn: policy?.Arn,
      VersionId: version1?.VersionId,
    });
    const { PolicyVersion: version2 } = await getPolicyVersion({
      PolicyArn: policy?.Arn,
      VersionId: version1?.VersionId,
    });

    expect(version2?.IsDefaultVersion).toBe(true);
  });
});

describe("Role APIs", () => {
  beforeEach(async () => {
    await deleteRolesByPath(path);
  });

  afterAll(async () => {
    await deleteRolesByPath(path);
  });

  test("Create, get, list, and delete role", async () => {
    const listCurrentRoles = async () => {
      const { Roles: roles } = await listRoles({ PathPrefix: path });
      return roles;
    };

    expect(await listCurrentRoles()).toHaveLength(0);

    const { Role: role1 } = await createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyJson),
      Path: path,
    });

    expect(await listCurrentRoles()).toHaveLength(1);
    expect(role1?.RoleName).toBe(roleName);

    const { Role: role2 } = await getRole({ RoleName: roleName });

    expect(role2?.RoleId).toBe(role1?.RoleId);

    await deleteRole({ RoleName: roleName });

    expect(await listCurrentRoles()).toHaveLength(0);
  });
});

describe("Role policy APIs", () => {
  beforeAll(async () => {
    await deleteRolesByPath(path);
    await createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyJson),
      Path: path,
    });
  });

  afterAll(async () => {
    await deleteRolesByPath(path);
  });

  test("Attach, list, and detach policy to role", async () => {
    const listCurrentAttachedRolePolicies = async () => {
      const { AttachedPolicies: policies } = await listAttachedRolePolicies({
        RoleName: roleName,
      });
      return policies;
    };

    expect(await listCurrentAttachedRolePolicies()).toHaveLength(0);

    await attachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await listCurrentAttachedRolePolicies()).toHaveLength(1);

    await detachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

    expect(await listCurrentAttachedRolePolicies()).toHaveLength(0);
  });

  test("Create, list, and delete inline role policy", async () => {
    const listCurrentRolePolicies = async () => {
      const { PolicyNames: policyNames } = await listRolePolicies({
        RoleName: roleName,
      });
      return policyNames;
    };

    expect(await listCurrentRolePolicies()).toHaveLength(0);

    await putRolePolicy({
      RoleName: roleName,
      PolicyDocument: JSON.stringify(identityBasedPolicyJson),
      PolicyName: rolePolicyName,
    });

    expect(await listCurrentRolePolicies()).toHaveLength(1);

    await deleteRolePolicy({
      RoleName: roleName,
      PolicyName: rolePolicyName,
    });

    expect(await listCurrentRolePolicies()).toHaveLength(0);
  });
});

describe("User APIs", () => {
  beforeEach(async () => {
    await deleteUsersByPath(path);
  });

  afterAll(async () => {
    await deleteUsersByPath(path);
  });

  test("Create, get, list, and delete user", async () => {
    const listCurrentUsers = async () => {
      const { Users: users } = await listUsers({ PathPrefix: path });
      return users;
    };

    expect(await listCurrentUsers()).toHaveLength(0);

    const { User: user1 } = await createUser({
      UserName: userName,
      Path: path,
    });

    expect(await listCurrentUsers()).toHaveLength(1);
    expect(user1?.UserName).toBe(userName);

    const { User: user2 } = await getUser({ UserName: userName });

    expect(user2?.UserId).toBe(user1?.UserId);

    await deleteUser({ UserName: userName });

    expect(await listCurrentUsers()).toHaveLength(0);
  });

  test("Update user", async () => {
    const oldUserName = "john_doe";
    await createUser({ UserName: oldUserName, Path: path });
    const { User: user1 } = await getUser({ UserName: oldUserName });

    expect(user1?.UserName).toBe(oldUserName);

    await updateUser({ UserName: oldUserName, NewUserName: userName });
    const { User: user2 } = await getUser({ UserName: userName });

    expect(user2?.UserName).toBe(userName);
    expect(user2?.UserId).toBe(user1?.UserId);
  });
});

describe("Access keys APIs", () => {
  beforeAll(async () => {
    await deleteUsersByPath(path);
    await createUser({ UserName: userName, Path: path });
  });

  beforeEach(async () => {
    await deleteAllUserAccessKeys(userName);
  });

  afterAll(async () => {
    await deleteUsersByPath(path);
  });

  test("Create, list, and delete access key", async () => {
    const listCurrentAccessKeys = async () => {
      const { AccessKeyMetadata: accessKeys } = await listAccessKeys({
        UserName: userName,
      });
      return accessKeys;
    };

    expect(await listCurrentAccessKeys()).toHaveLength(0);

    await createAccessKey({ UserName: userName });
    const accessKeys = await listCurrentAccessKeys();

    expect(accessKeys).toHaveLength(1);

    await deleteAccessKey({
      UserName: userName,
      AccessKeyId: accessKeys?.[0].AccessKeyId,
    });

    expect(await listCurrentAccessKeys()).toHaveLength(0);
  });

  test("Get access key last used info", async () => {
    const { AccessKey: accessKey } = await createAccessKey({
      UserName: userName,
    });
    const { AccessKeyLastUsed: lastUsed } = await getAccessKeyLastUsed({
      AccessKeyId: accessKey?.AccessKeyId,
    });

    expect(lastUsed?.LastUsedDate).toBeUndefined();
    expect(lastUsed?.Region).toBe("N/A");
    expect(lastUsed?.ServiceName).toBe("N/A");
  });

  test("Deactivate access key", async () => {
    const getFirstAccessKeyStatus = async () => {
      const { AccessKeyMetadata: accessKeys } = await listAccessKeys({
        UserName: userName,
      });
      const status = accessKeys?.[0].Status;
      return status;
    };
    const { AccessKey: accessKey } = await createAccessKey({
      UserName: userName,
    });

    expect(await getFirstAccessKeyStatus()).toBe("Active");

    await updateAccessKey({
      AccessKeyId: accessKey?.AccessKeyId,
      UserName: userName,
      Status: "Inactive",
    });

    expect(await getFirstAccessKeyStatus()).toBe("Inactive");
  });
});

describe("User policy APIs", () => {
  beforeAll(async () => {
    await deleteUsersByPath(path);
    await createUser({ UserName: userName, Path: path });
  });

  afterAll(async () => {
    await deleteUsersByPath(path);
  });

  test("Attach, list, and detach policy to user", async () => {
    const listCurrentAttachedUserPolicies = async () => {
      const { AttachedPolicies: policies } = await listAttachedUserPolicies({
        UserName: userName,
      });
      return policies;
    };

    expect(await listCurrentAttachedUserPolicies()).toHaveLength(0);

    await attachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await listCurrentAttachedUserPolicies()).toHaveLength(1);

    await detachUserPolicy({ UserName: userName, PolicyArn: policyArn });

    expect(await listCurrentAttachedUserPolicies()).toHaveLength(0);
  });

  test("Create, list, and delete inline user policy", async () => {
    const listCurrentUserPolicies = async () => {
      const { PolicyNames: policyNames } = await listUserPolicies({
        UserName: userName,
      });
      return policyNames;
    };

    expect(await listCurrentUserPolicies()).toHaveLength(0);

    await putUserPolicy({
      UserName: userName,
      PolicyDocument: JSON.stringify(identityBasedPolicyJson),
      PolicyName: userPolicyName,
    });

    expect(await listCurrentUserPolicies()).toHaveLength(1);

    await deleteUserPolicy({
      UserName: userName,
      PolicyName: userPolicyName,
    });

    expect(await listCurrentUserPolicies()).toHaveLength(0);
  });
});

describe("Account alias APIs", () => {
  afterAll(async () => {
    await createAccountAlias({ AccountAlias: accountAlias });
  });

  test("Create, list, and delete account alias", async () => {
    const listCurrentAccountAliases = async () => {
      const { AccountAliases: aliases } = await listAccountAliases({});
      return aliases;
    };
    const alias2 = `${accountAlias}2`;
    await createAccountAlias({ AccountAlias: alias2 });
    const aliases = await listCurrentAccountAliases();

    expect(aliases).toHaveLength(1);
    expect(aliases?.[0]).toBe(alias2);

    await deleteAccountAlias({ AccountAlias: alias2 });

    expect(await listCurrentAccountAliases()).toHaveLength(0);
  });
});

describe("Account summary APIs", () => {
  beforeAll(async () => {
    await deleteUsersByPath(path);
    await createUser({ UserName: userName, Path: path });
  });

  afterAll(async () => {
    await deleteUsersByPath(path);
  });

  test("Generate and get credentials report", async () => {
    await createAccessKey({ UserName: userName });
    await generateCredentialReport({});
    const { Content: content } = await getCredentialReport({});
    const report = Buffer.from(content ?? []).toString();
    const [header, ...body] = report
      .trimEnd()
      .split("\n")
      .map(row => row.split(","));

    expect(header[0]).toBe("user");
    expect(body.findIndex(row => row[0] === userName)).toBeGreaterThan(-1);
  });

  test("Get account summary", async () => {
    const { SummaryMap: summary } = await getAccountSummary({});

    expect(summary?.Groups).toBeGreaterThanOrEqual(0);
    expect(summary?.Users).toBeGreaterThanOrEqual(1);
  });

  test("Get account authorization details", async () => {
    const { UserDetailList: users, Policies: policies } =
      await getAccountAuthorizationDetails({});

    expect(
      users?.findIndex(user => user.UserName === userName)
    ).toBeGreaterThan(-1);
    expect(
      policies?.findIndex(policy => policy.PolicyName === "AdministratorAccess")
    ).toBeGreaterThan(-1);
  });
});
