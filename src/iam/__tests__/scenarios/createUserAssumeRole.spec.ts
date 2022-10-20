// iam/__tests__/scenarios/createUserAssumeRole.spec.ts
import { IAMWrapper } from "../..";
import { S3Wrapper } from "../../../s3";
import { STSWrapper } from "../../../sts";
import { isLocal, sleep } from "../utils";
import { policyName, roleName, roleSessionName, userName } from "../dummy";

jest.setTimeout((isLocal ? 5 : 60) * 1000);

const iam = new IAMWrapper();

beforeAll(async () => {
  await iam.deleteUsersByPrefix(userName);
  await iam.deleteRolesByPrefix(roleName);
  await iam.deletePoliciesByPrefix(policyName);
});

afterAll(async () => {
  await iam.deleteUsersByPrefix(userName);
  await iam.deleteRolesByPrefix(roleName);
  await iam.deletePoliciesByPrefix(policyName);
});

test("Create an IAM user and assume a role", async () => {
  const stsPolicyName = `${policyName}STS`;
  const s3PolicyName = `${policyName}S3`;

  // Create a new user.
  const { User: user } = await iam.createUser({ UserName: userName });

  // Create access keys for the new user.
  const { AccessKey } = await iam.createAccessKey({
    UserName: userName,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const accessKeyId = AccessKey!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const secretAccessKey = AccessKey!.SecretAccessKey!;

  // Need to wait until the user and the access key are active.
  await sleep(isLocal ? 0 : 10);

  // Create a role with a trust policy that lets the user assume the role.
  const { Role } = await iam.createRole({
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: user?.Arn },
          Action: "sts:AssumeRole",
        },
      ],
    }),
  });

  // Create a new policy to allow the role to list all buckets.
  const { Policy: s3Policy } = await iam.createPolicy({
    PolicyName: s3PolicyName,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:ListAllMyBuckets", "sts:AssumeRole"],
          Resource: "*",
        },
      ],
    }),
  });

  // Attach to the role the policy with permissions to list all buckets.
  await iam.attachRolePolicy({ PolicyArn: s3Policy?.Arn, RoleName: roleName });

  // Create a policy that enables the user to assume the role.
  const { Policy: stsPolicy } = await iam.createPolicy({
    PolicyName: stsPolicyName,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        { Effect: "Allow", Action: "sts:AssumeRole", Resource: Role?.Arn },
      ],
    }),
  });

  // Attach the policy to the user.
  await iam.attachUserPolicy({
    PolicyArn: stsPolicy?.Arn,
    UserName: userName,
  });

  // Need to wait until the policy has been attached to the user.
  await sleep(isLocal ? 0 : 15);

  // Assume for the user the role with permission to list all buckets
  const userSts = new STSWrapper({
    credentials: { accessKeyId, secretAccessKey },
  });
  const { Credentials } = await userSts.assumeRole({
    RoleArn: Role?.Arn,
    RoleSessionName: roleSessionName,
    DurationSeconds: 900,
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newAccessKeyId = Credentials!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newSecretAccessKey = Credentials!.SecretAccessKey!;
  const sessionToken = Credentials?.SessionToken;

  // Need to wait until for the user to assume the role
  await sleep(isLocal ? 0 : 10);

  // List all S3 buckets.
  const assumedS3 = new S3Wrapper({
    credentials: {
      accessKeyId: newAccessKeyId,
      secretAccessKey: newSecretAccessKey,
      sessionToken,
    },
  });
  const { Buckets } = await assumedS3.listBuckets({});

  expect(Buckets instanceof Array).toBe(true);

  // Detach assume role policy from the user.
  await iam.detachUserPolicy({
    PolicyArn: stsPolicy?.Arn,
    UserName: userName,
  });

  // Detach s3 policy from the role.
  await iam.detachRolePolicy({ PolicyArn: s3Policy?.Arn, RoleName: roleName });

  // Delete assume role policy.
  await iam.deletePolicy({ PolicyArn: stsPolicy?.Arn });

  // Delete s3 policy.
  await iam.deletePolicy({ PolicyArn: s3Policy?.Arn });

  // Delete access keys.
  await iam.deleteAccessKey({ UserName: userName, AccessKeyId: accessKeyId });

  // Delete user.
  await iam.deleteUser({ UserName: userName });

  // Delete role.
  await iam.deleteRole({ RoleName: roleName });
});
