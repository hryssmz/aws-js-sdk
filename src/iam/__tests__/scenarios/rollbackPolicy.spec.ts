// iam/__tests__/scenarios/rollbackPolicy.spec.ts
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

test("Roll back an IAM policy version", async () => {
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

  // Need to wait for one second.
  await sleep(1);

  // Create another version and set as default.
  await iam.createPolicyVersion({
    PolicyArn,
    PolicyDocument: JSON.stringify(managedPolicy2Json),
    SetAsDefault: true,
  });

  // Get the list of policy versions in order by date.
  const versions = await iam
    .listPolicyVersions({ PolicyArn })
    .then(({ Versions }) =>
      Versions?.sort(
        (a, b) =>
          (a.CreateDate ?? new Date()).valueOf() -
          (b.CreateDate ?? new Date()).valueOf()
      )
    );

  // Find the default policy version.
  const defaultVersionIdx =
    versions?.findIndex(version => version.IsDefaultVersion) ?? -1;
  const { PolicyVersion: defaultVersion } = await iam.getPolicyVersion({
    PolicyArn,
    VersionId: versions?.[defaultVersionIdx].VersionId,
  });
  const { PolicyVersion: previousVersion } = await iam.getPolicyVersion({
    PolicyArn,
    VersionId: versions?.[defaultVersionIdx - 1].VersionId,
  });

  expect(
    JSON.parse(decodeURIComponent(defaultVersion?.Document ?? ""))
  ).toStrictEqual(managedPolicy2Json);
  expect(
    JSON.parse(decodeURIComponent(previousVersion?.Document ?? ""))
  ).toStrictEqual(managedPolicyJson);

  // Make the previous policy version the default.
  await iam.setDefaultPolicyVersion({
    PolicyArn,
    VersionId: previousVersion?.VersionId,
  });

  // Delete the old default version.
  await iam.deletePolicyVersion({
    PolicyArn,
    VersionId: defaultVersion?.VersionId,
  });

  const { PolicyVersion: newDefaultVersion } = await iam
    .listPolicyVersions({ PolicyArn })
    .then(
      ({ Versions }) =>
        Versions?.find(({ IsDefaultVersion }) => IsDefaultVersion)?.VersionId
    )
    .then(VersionId => iam.getPolicyVersion({ PolicyArn, VersionId }));

  expect(
    JSON.parse(decodeURIComponent(newDefaultVersion?.Document ?? ""))
  ).toStrictEqual(managedPolicyJson);

  // Delete the policy.
  await iam.deletePolicy({ PolicyArn });
});
