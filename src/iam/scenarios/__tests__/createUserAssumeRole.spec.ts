// iam/scenarios/__tests__/createUserAssumeRole.spec.ts
import { createUserAssumeRole } from "../createUserAssumeRole";
import {
  deletePoliciesByPath,
  deleteRolesByPath,
  deleteUsersByPath,
  isLocal,
} from "./utils";
import { path, roleName, userName } from "./dummy";

jest.setTimeout((isLocal ? 5 : 120) * 1000);

beforeAll(async () => {
  await deleteUsersByPath(path);
  await deletePoliciesByPath(path);
  await deleteRolesByPath(path);
});

test("run createUserAssumeRole", async () => {
  const buckets = await createUserAssumeRole({
    assumePolicyName: "DummyAssumePolicy",
    path,
    roleName,
    roleSessionName: "DummyRoleSession",
    s3PolicyName: "DummyS3Policy",
    userName: userName,
  });

  expect(buckets instanceof Array).toBe(true);
});
