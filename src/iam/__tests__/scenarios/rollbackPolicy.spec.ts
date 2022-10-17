// iam/__tests__/scenarios/rollbackPolicy.spec.ts
import { IAMWrapper } from "../..";
import { deletePoliciesByPath, sleep } from "../utils";
import { identityBasedPolicyJson, path, policyName } from "../dummy";

beforeAll(async () => {
  await deletePoliciesByPath(path);
});

afterAll(async () => {
  await deletePoliciesByPath(path);
});

test("Roll back an IAM policy version", async () => {
  const iam = new IAMWrapper();

  const identityBasedPolicyV2Json = {
    ...identityBasedPolicyJson,
    Statement: [
      {
        ...identityBasedPolicyJson.Statement[0],
        Action: ["s3:GetObject", "s3:PutObject"],
      },
    ],
  };

  // Create a policy.
  const { Policy: policy } = await iam.createPolicy({
    PolicyName: policyName,
    Path: path,
    PolicyDocument: JSON.stringify(identityBasedPolicyJson),
  });

  // Need to wait for one second.
  await sleep(1);

  // Create another version and set as default.
  await iam.createPolicyVersion({
    PolicyArn: policy?.Arn,
    PolicyDocument: JSON.stringify(identityBasedPolicyV2Json),
    SetAsDefault: true,
  });

  // Get the list of policy versions in order by date.
  const versions = await iam
    .listPolicyVersions({ PolicyArn: policy?.Arn })
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
    PolicyArn: policy?.Arn,
    VersionId: versions?.[defaultVersionIdx].VersionId,
  });
  const { PolicyVersion: previousVersion } = await iam.getPolicyVersion({
    PolicyArn: policy?.Arn,
    VersionId: versions?.[defaultVersionIdx - 1].VersionId,
  });

  expect(
    JSON.parse(decodeURIComponent(defaultVersion?.Document ?? ""))
  ).toStrictEqual(identityBasedPolicyV2Json);
  expect(
    JSON.parse(decodeURIComponent(previousVersion?.Document ?? ""))
  ).toStrictEqual(identityBasedPolicyJson);

  // Make the previous policy version the default.
  await iam.setDefaultPolicyVersion({
    PolicyArn: policy?.Arn,
    VersionId: previousVersion?.VersionId,
  });

  // Delete the old default version.
  await iam.deletePolicyVersion({
    PolicyArn: policy?.Arn,
    VersionId: defaultVersion?.VersionId,
  });

  const { PolicyVersion: newDefaultVersion } = await iam
    .listPolicyVersions({ PolicyArn: policy?.Arn })
    .then(res => res.Versions?.find(version => version.IsDefaultVersion))
    .then(version =>
      iam.getPolicyVersion({
        PolicyArn: policy?.Arn,
        VersionId: version?.VersionId,
      })
    );

  expect(
    JSON.parse(decodeURIComponent(newDefaultVersion?.Document ?? ""))
  ).toStrictEqual(identityBasedPolicyJson);

  // Delete the policy.
  await iam.deletePolicy({ PolicyArn: policy?.Arn });
});
