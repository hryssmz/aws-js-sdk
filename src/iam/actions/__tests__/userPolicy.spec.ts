// iam/actions/__tests__/userPolicy.spec.ts
import {
  attachUserPolicy,
  deleteUserPolicy,
  listAttachedUserPolicies,
  listUserPolicies,
  putUserPolicy,
} from "../userPolicy";
import { createUser } from "../user";
import {
  identityBasedPolicyJson,
  path,
  policyArn,
  userName,
  userPolicyName,
} from "./dummy";
import { deleteUsersByPath } from "./utils";

beforeAll(async () => {
  await deleteUsersByPath(path);
  await createUser({ UserName: userName, Path: path });
});

afterAll(async () => {
  await deleteUsersByPath(path);
});

test("Attach policy to user", async () => {
  await attachUserPolicy({ UserName: userName, PolicyArn: policyArn });
  const { AttachedPolicies: policies } = await listAttachedUserPolicies({
    UserName: userName,
  });

  expect(policies).toHaveLength(1);
});

test("Add and remove inline user policy", async () => {
  const { PolicyNames: policyNames1 } = await listUserPolicies({
    UserName: userName,
  });

  expect(policyNames1).toHaveLength(0);

  await putUserPolicy({
    UserName: userName,
    PolicyDocument: JSON.stringify(identityBasedPolicyJson),
    PolicyName: userPolicyName,
  });
  const { PolicyNames: policyNames2 } = await listUserPolicies({
    UserName: userName,
  });

  expect(policyNames2).toHaveLength(1);

  await deleteUserPolicy({ UserName: userName, PolicyName: userPolicyName });
  const { PolicyNames: policyNames3 } = await listUserPolicies({
    UserName: userName,
  });

  expect(policyNames3).toHaveLength(0);
});
