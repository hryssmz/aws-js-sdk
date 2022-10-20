// iam/__tests__/scenarios/managePolicies.spec.ts
import { IAMWrapper } from "../..";
import { isLocal, sleep } from "../utils";
import { managedPolicyJson, policyName } from "../dummy";

jest.setTimeout((isLocal ? 5 : 15) * 1000);

const iam = new IAMWrapper();

beforeAll(async () => {
  await iam.deletePoliciesByPrefix(policyName);
});

afterAll(async () => {
  await iam.deletePoliciesByPrefix(policyName);
});

test("Manage IAM policies", async () => {
  const managedPolicy2Json = {
    ...managedPolicyJson,
    Statement: [
      {
        ...managedPolicyJson.Statement[0],
        Action: ["s3:GetObject", "s3:PutObject"],
      },
    ],
  };

  // Create a policy.
  const { Policy } = await iam.createPolicy({
    PolicyName: policyName,
    PolicyDocument: JSON.stringify(managedPolicyJson),
  });
  const PolicyArn = Policy?.Arn;

  // List pocilies.
  const { Policies } = await iam.listPolicies({ Scope: "Local" });

  expect(Policies).toHaveLength(1);

  await sleep(1);

  // Add a new policy version.
  await iam.createPolicyVersion({
    PolicyArn,
    PolicyDocument: JSON.stringify(managedPolicy2Json),
    SetAsDefault: true,
  });

  // Get the default policy.
  const getPolicyDefaultVersionJson = async () => {
    const { PolicyVersion } = await iam
      .getPolicy({ PolicyArn })
      .then(({ Policy }) => Policy?.DefaultVersionId)
      .then(VersionId => iam.getPolicyVersion({ PolicyArn, VersionId }));
    const json = JSON.parse(decodeURIComponent(PolicyVersion?.Document ?? ""));
    return json;
  };

  expect(await getPolicyDefaultVersionJson()).toStrictEqual(managedPolicy2Json);

  // Roll back version.
  const versions = await iam
    .listPolicyVersions({ PolicyArn })
    .then(({ Versions }) =>
      Versions?.sort(
        (a, b) =>
          (a.CreateDate ?? new Date()).valueOf() -
          (b.CreateDate ?? new Date()).valueOf()
      )
    );

  const defaultVersionIdx =
    versions?.findIndex(({ IsDefaultVersion }) => IsDefaultVersion) ?? -1;
  const defaultVersion = versions?.[defaultVersionIdx];
  const previousVersion = versions?.[defaultVersionIdx - 1];

  await iam.setDefaultPolicyVersion({
    PolicyArn,
    VersionId: previousVersion?.VersionId,
  });

  expect(await getPolicyDefaultVersionJson()).toStrictEqual(managedPolicyJson);

  await iam.deletePolicyVersion({
    PolicyArn,
    VersionId: defaultVersion?.VersionId,
  });

  // Delete the policy.
  await iam.deletePolicy({ PolicyArn });
});
