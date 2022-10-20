// iam/__tests__/scenarios/manageRoles.spec.ts
import { IAMWrapper } from "../..";
import { isLocal } from "../utils";
import {
  managedPolicyJson,
  policyArn,
  policyName,
  roleName,
  trustPolicyJson,
} from "../dummy";

jest.setTimeout((isLocal ? 5 : 15) * 1000);

const iam = new IAMWrapper();

beforeAll(async () => {
  await iam.deleteRolesByPrefix(roleName);
});

afterAll(async () => {
  await iam.deleteRolesByPrefix(roleName);
});

test("Manage IAM roles", async () => {
  // Create a role.
  await iam.createRole({
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify(trustPolicyJson),
  });

  // List roles.
  const { Roles } = await iam.listRoles({});

  expect(
    Roles?.findIndex(({ RoleName }) => RoleName === roleName)
  ).toBeGreaterThan(-1);

  // Create an inline policy for role.
  await iam.putRolePolicy({
    RoleName: roleName,
    PolicyName: policyName,
    PolicyDocument: JSON.stringify(managedPolicyJson),
  });

  // List inline policies.
  const { PolicyNames } = await iam.listRolePolicies({
    RoleName: roleName,
  });

  expect(PolicyNames).toStrictEqual([policyName]);

  // Attach a policy to the role.
  await iam.attachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

  // List attached policies.
  const { AttachedPolicies } = await iam.listAttachedRolePolicies({
    RoleName: roleName,
  });

  expect(AttachedPolicies?.map(({ PolicyArn }) => PolicyArn)).toStrictEqual([
    policyArn,
  ]);

  // Delete the inline policy.
  await iam.deleteRolePolicy({
    RoleName: roleName,
    PolicyName: policyName,
  });

  // Detach the policy.
  await iam.detachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });

  // Delete the role.
  await iam.deleteRole({ RoleName: roleName });
});
