// s3/__tests__/scenarios/presignedUrl.spec.ts
import axios from "axios";
import { S3Wrapper } from "../..";
import { bucket, objectBody, objectKey } from "../dummy";

const s3 = new S3Wrapper();

beforeAll(async () => {
  await s3.deleteBucketsByPrefix(bucket);
});

afterAll(async () => {
  await s3.deleteBucketsByPrefix(bucket);
});

test("Create a presigned URL", async () => {
  // Create a dummy bucket.
  await s3.createBucket({ Bucket: bucket });

  // Put an object into the S3 bucket.
  await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

  // Get the presigned URL.
  const signedUrl = await s3.getObjectUrl(
    { Bucket: bucket, Key: objectKey },
    { expiresIn: 3600 }
  );

  // Get the object data.
  const { status, data } = await axios(signedUrl);

  expect(status).toBe(200);
  expect(data).toBe(objectBody);

  // Delete the object.
  await s3.deleteObject({ Bucket: bucket, Key: objectKey });

  // Delete the S3 bucket.
  await s3.deleteBucket({ Bucket: bucket });
});
