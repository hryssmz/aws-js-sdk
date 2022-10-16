// iam/actions/__tests__/policy.spec.ts
import { createPolicy, getPolicy } from "../policy";
import { identityBasedPolicyJson, path, policyName } from "./dummy";
import { deletePoliciesByPath } from "./utils";

beforeEach(async () => {
  await deletePoliciesByPath(path);
});

afterAll(async () => {
  await deletePoliciesByPath(path);
});

test("Create policy", async () => {
  const { Policy: policy1 } = await createPolicy({
    PolicyName: policyName,
    PolicyDocument: JSON.stringify(identityBasedPolicyJson),
    Path: path,
  });

  expect(policy1?.PolicyName).toBe(policyName);

  if (policy1?.Arn === undefined) {
    throw new Error();
  }

  const { Policy: policy2 } = await getPolicy({ PolicyArn: policy1.Arn });

  expect(policy2?.PolicyId).toBe(policy1.PolicyId);
});
