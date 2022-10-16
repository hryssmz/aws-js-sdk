// s3/actions/__tests__/bucket.spec.ts
import { createBucket } from "../bucket";
import { bucketName } from "./dummy";
import { deleteDummyBuckets } from "./utils";

beforeEach(async () => {
  await deleteDummyBuckets();
});

afterAll(async () => {
  await deleteDummyBuckets();
});

test("Create bucket", async () => {
  const { Location: location } = await createBucket({ Bucket: bucketName });

  expect(location).toStrictEqual(expect.stringContaining(bucketName));
});
