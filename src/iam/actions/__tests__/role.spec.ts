// iam/actions/__tests__/role.spec.ts
import { createRole, getRole } from "../role";
import { assumeRolePolicyJson, path, roleName } from "./dummy";
import { deleteRolesByPath } from "./utils";

beforeEach(async () => {
  await deleteRolesByPath(path);
});

afterAll(async () => {
  await deleteRolesByPath(path);
});

test("Create role", async () => {
  const { Role: role1 } = await createRole({
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyJson),
    Path: path,
  });

  expect(role1?.RoleName).toBe(roleName);

  const { Role: role2 } = await getRole({ RoleName: roleName });

  expect(role2?.RoleId).toBe(role1?.RoleId);
});
