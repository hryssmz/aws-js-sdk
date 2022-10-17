// iam/__tests__/scenarios/createUserAssumeRole.spec.ts
import { IAMWrapper } from "../..";
import { S3Wrapper } from "../../../s3";
import { STSWrapper } from "../../../sts";
import {
  deletePoliciesByPath,
  deleteRolesByPath,
  deleteUsersByPath,
  isLocal,
  sleep,
} from "../utils";
import { path, roleName, userName } from "../dummy";

jest.setTimeout((isLocal ? 5 : 120) * 1000);

beforeAll(async () => {
  await deleteUsersByPath(path);
  await deletePoliciesByPath(path);
  await deleteRolesByPath(path);
});

afterAll(async () => {
  await deleteUsersByPath(path);
  await deletePoliciesByPath(path);
  await deleteRolesByPath(path);
});

test("Create an IAM user and assume a role", async () => {
  const iam = new IAMWrapper();
  const assumePolicyName = "DummyAssumePolicy";
  const s3PolicyName = "DummyS3Policy";

  // Create a new user.
  const { User: user } = await iam.createUser({
    UserName: userName,
    Path: path,
  });

  // Create access keys for the new user.
  const { AccessKey: accessKey } = await iam.createAccessKey({
    UserName: userName,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const accessKeyId = accessKey!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const secretAccessKey = accessKey!.SecretAccessKey!;

  // Need to wait until the user and the access key are active.
  await sleep(isLocal ? 0 : 10);

  // Create a role with a trust policy that lets the user assume the role.
  const { Role: role } = await iam.createRole({
    RoleName: roleName,
    Path: path,
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
    Path: path,
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
  const { Policy: assumePolicy } = await iam.createPolicy({
    PolicyName: assumePolicyName,
    Path: path,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "sts:AssumeRole",
          Resource: role?.Arn,
        },
      ],
    }),
  });

  // Attach the policy to the user.
  await iam.attachUserPolicy({
    PolicyArn: assumePolicy?.Arn,
    UserName: userName,
  });

  // Need to wait until the policy has been attached to the user.
  await sleep(isLocal ? 0 : 15);

  // Assume for the user the role with permission to list all buckets
  const userSts = new STSWrapper({
    credentials: { accessKeyId, secretAccessKey },
  });
  const { Credentials: credentials } = await userSts.assumeRole({
    RoleArn: role?.Arn,
    RoleSessionName: "DummyRoleSession",
    DurationSeconds: 900,
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newAccessKeyId = credentials!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newSecretAccessKey = credentials!.SecretAccessKey!;
  const sessionToken = credentials?.SessionToken;

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
  const { Buckets: buckets } = await assumedS3.listBuckets({});

  expect(buckets instanceof Array).toBe(true);

  // Detach assume role policy from the user.
  await iam.detachUserPolicy({
    PolicyArn: assumePolicy?.Arn,
    UserName: userName,
  });

  // Detach s3 policy from the role.
  await iam.detachRolePolicy({ PolicyArn: s3Policy?.Arn, RoleName: roleName });

  // Delete assume role policy.
  await iam.deletePolicy({ PolicyArn: assumePolicy?.Arn });

  // Delete s3 policy.
  await iam.deletePolicy({ PolicyArn: s3Policy?.Arn });

  // Delete access keys.
  await iam.deleteAccessKey({ UserName: userName, AccessKeyId: accessKeyId });

  // Delete user.
  await iam.deleteUser({ UserName: userName });

  // Delete role.
  await iam.deleteRole({ RoleName: roleName });
});
