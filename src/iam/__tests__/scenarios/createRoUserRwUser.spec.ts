// iam/__tests__/scenarios/createRoUserRwUser.spec.ts
import { IAMWrapper } from "../..";
import { S3Wrapper } from "../../../s3";
import { isLocal, sleep } from "../utils";
import { bucket, objectBody, objectKey, policyName, userName } from "../dummy";

jest.setTimeout((isLocal ? 5 : 40) * 1000);

const iam = new IAMWrapper();
const s3 = new S3Wrapper();

beforeAll(async () => {
  await iam.deleteUsersByPrefix(userName);
  await iam.deletePoliciesByPrefix(policyName);
  await s3.deleteBucketsByPrefix(bucket);
});

afterAll(async () => {
  await iam.deleteUsersByPrefix(userName);
  await iam.deletePoliciesByPrefix(policyName);
  await s3.deleteBucketsByPrefix(bucket);
});

test("Create read-only and read-write IAM users", async () => {
  const readOnlyUserName = `${userName}RO`;
  const readWriteUserName = `${userName}RW`;
  const readOnlyPolicyName = `${policyName}RO`;
  const readWritePolicyName = `${policyName}RW`;

  // Create a bucket.
  const bucketArn = `arn:aws:s3:::${bucket}/*`;
  await s3.createBucket({ Bucket: bucket });

  // Create two IAM users.
  await iam.createUser({ UserName: readOnlyUserName });
  await iam.createUser({ UserName: readWriteUserName });

  // Create access keys.
  const { AccessKey: roAccessKey } = await iam.createAccessKey({
    UserName: readOnlyUserName,
  });
  const roCredentials = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    accessKeyId: roAccessKey!.AccessKeyId!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    secretAccessKey: roAccessKey!.SecretAccessKey!,
  };
  const { AccessKey: rwAccessKey } = await iam.createAccessKey({
    UserName: readWriteUserName,
  });
  const rwCredentials = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    accessKeyId: rwAccessKey!.AccessKeyId!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    secretAccessKey: rwAccessKey!.SecretAccessKey!,
  };

  // Create two policies.
  const { Policy: roPolicy } = await iam.createPolicy({
    PolicyName: readOnlyPolicyName,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        { Effect: "Allow", Action: "s3:GetObject", Resource: bucketArn },
      ],
    }),
  });
  const { Policy: rwPolicy } = await iam.createPolicy({
    PolicyName: readWritePolicyName,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:GetObject", "s3:PutObject"],
          Resource: bucketArn,
        },
      ],
    }),
  });

  // Attach policies to each user
  await iam.attachUserPolicy({
    UserName: readOnlyUserName,
    PolicyArn: roPolicy?.Arn,
  });
  await iam.attachUserPolicy({
    UserName: readWriteUserName,
    PolicyArn: rwPolicy?.Arn,
  });

  // Need to wait until the policies have been attached to the users.
  await sleep(isLocal ? 0 : 15);

  const rwS3 = new S3Wrapper({ credentials: rwCredentials });
  const roS3 = new S3Wrapper({ credentials: roCredentials });

  // Read write user can upload object.
  await rwS3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

  // Read write user can read object.
  const body1 = await rwS3
    .getObject({ Bucket: bucket, Key: objectKey })
    .then(({ Body }) => Body?.transformToString());

  // Read only user can read object.
  const body2 = await roS3
    .getObject({ Bucket: bucket, Key: objectKey })
    .then(({ Body }) => Body?.transformToString());

  expect(body1).toBe(objectBody);
  expect(body2).toBe(objectBody);

  // Detach policies.
  await iam.detachUserPolicy({
    PolicyArn: roPolicy?.Arn,
    UserName: readOnlyUserName,
  });
  await iam.detachUserPolicy({
    PolicyArn: rwPolicy?.Arn,
    UserName: readWriteUserName,
  });

  // Delete policies.
  await iam.deletePolicy({ PolicyArn: roPolicy?.Arn });
  await iam.deletePolicy({ PolicyArn: rwPolicy?.Arn });

  // Delete access keys.
  await iam.deleteAccessKey({
    UserName: readOnlyUserName,
    AccessKeyId: roCredentials.accessKeyId,
  });
  await iam.deleteAccessKey({
    UserName: readWriteUserName,
    AccessKeyId: rwCredentials.accessKeyId,
  });

  // Delete users.
  await iam.deleteUser({ UserName: readOnlyUserName });
  await iam.deleteUser({ UserName: readWriteUserName });

  // Delete all bucket objects.
  await s3.deleteObject({ Bucket: bucket, Key: objectKey });

  // Delete bucket.
  await s3.deleteBucket({ Bucket: bucket });
});
