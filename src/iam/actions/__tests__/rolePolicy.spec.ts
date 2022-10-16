// iam/actions/__tests__/rolePolicy.spec.ts
import {
  attachRolePolicy,
  deleteRolePolicy,
  listAttachedRolePolicies,
  listRolePolicies,
  putRolePolicy,
} from "../rolePolicy";
import { createRole } from "../role";
import {
  assumeRolePolicyJson,
  identityBasedPolicyJson,
  path,
  policyArn,
  roleName,
  rolePolicyName,
} from "./dummy";
import { deleteRolesByPath } from "./utils";

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

test("Attach policy to role", async () => {
  await attachRolePolicy({ RoleName: roleName, PolicyArn: policyArn });
  const { AttachedPolicies: policies } = await listAttachedRolePolicies({
    RoleName: roleName,
  });

  expect(policies).toHaveLength(1);
});

test("Add and remove inline role policy", async () => {
  const { PolicyNames: policyNames1 } = await listRolePolicies({
    RoleName: roleName,
  });

  expect(policyNames1).toHaveLength(0);

  await putRolePolicy({
    RoleName: roleName,
    PolicyDocument: JSON.stringify(identityBasedPolicyJson),
    PolicyName: rolePolicyName,
  });
  const { PolicyNames: policyNames2 } = await listRolePolicies({
    RoleName: roleName,
  });

  expect(policyNames2).toHaveLength(1);

  await deleteRolePolicy({ RoleName: roleName, PolicyName: rolePolicyName });
  const { PolicyNames: policyNames3 } = await listRolePolicies({
    RoleName: roleName,
  });

  expect(policyNames3).toHaveLength(0);
});
