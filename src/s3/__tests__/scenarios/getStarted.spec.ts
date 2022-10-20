// s3/__tests__/scenarios/getStarted.spec.ts
import { S3Wrapper } from "../..";
import { bucket, objectBody, objectKey } from "../dummy";

const s3 = new S3Wrapper();

beforeAll(async () => {
  await s3.deleteBucketsByPrefix(bucket);
});

afterAll(async () => {
  await s3.deleteBucketsByPrefix(bucket);
});

test("Get started with Amazon S3 buckets and objects", async () => {
  // Create buckets.
  await s3.createBucket({ Bucket: bucket });

  // Upload an object.
  await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

  // Download the object.
  const body = await s3
    .getObject({ Bucket: bucket, Key: objectKey })
    .then(({ Body }) => Body?.transformToString());

  expect(body).toBe(objectBody);

  // Copy the object from the first bucket to the second bucket.
  const targetKey = `copy-destination/${objectKey}`;
  await s3.copyObject({
    Bucket: bucket,
    CopySource: `/${bucket}/${objectKey}`,
    Key: targetKey,
  });

  // Delete the original object.
  await s3.deleteObject({ Bucket: bucket, Key: objectKey });

  // Delete the copied object.
  await s3.deleteObject({ Bucket: bucket, Key: targetKey });

  // Delete the bucket.
  await s3.deleteBucket({ Bucket: bucket });
});
