// s3/__test__/wrapper.spec.ts
import url from "node:url";
import axios from "axios";
import { S3Wrapper } from "../wrapper";
import { bucket, objectKey, objectBody } from "./dummy";
import { isLocal } from "./utils";

const s3 = new S3Wrapper();

describe("Bucket APIs", () => {
  beforeEach(async () => {
    await s3.deleteBucketsByPrefix(bucket);
  });

  afterAll(async () => {
    await s3.deleteBucketsByPrefix(bucket);
  });

  const getNumberOfBuckets = async () => {
    const { Buckets } = await s3.listBuckets({});
    return Buckets?.length ?? 0;
  };

  test("Create, list, and delete bucket", async () => {
    const numberOfBuckets = await getNumberOfBuckets();
    const { Location } = await s3.createBucket({ Bucket: bucket });

    expect(await getNumberOfBuckets()).toBe(numberOfBuckets + 1);
    expect(Location).toStrictEqual(expect.stringContaining(bucket));

    await s3.deleteBucket({ Bucket: bucket });

    expect(await getNumberOfBuckets()).toBe(numberOfBuckets);
  });

  test("deleteBucketsByPrefix() helper", async () => {
    const numberOfBuckets = await getNumberOfBuckets();
    await s3.createBucket({ Bucket: bucket });

    expect(await getNumberOfBuckets()).toBe(numberOfBuckets + 1);

    await s3.deleteBucketsByPrefix(bucket);

    expect(await getNumberOfBuckets()).toBe(numberOfBuckets);
  });
});

describe("Object APIs", () => {
  beforeAll(async () => {
    await s3.deleteBucketsByPrefix(bucket);
    await s3.createBucket({ Bucket: bucket });
  });

  beforeEach(async () => {
    await s3.deleteAllObjects(bucket);
  });

  afterAll(async () => {
    await s3.deleteBucketsByPrefix(bucket);
  });

  const getNumberOfObjects = async (Bucket?: string) => {
    const { Contents } = await s3.listObjects({ Bucket });
    return Contents?.length ?? 0;
  };

  test("Upload, get, list and delete object", async () => {
    expect(await getNumberOfObjects(bucket)).toBe(0);

    await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

    expect(await getNumberOfObjects(bucket)).toBe(1);

    const body = await s3
      .getObject({ Bucket: bucket, Key: objectKey })
      .then(({ Body }) => Body?.transformToString());

    expect(body).toBe(objectBody);

    await s3.deleteObject({ Bucket: bucket, Key: objectKey });

    expect(await getNumberOfObjects(bucket)).toBe(0);
  });

  test("Delete all objects", async () => {
    await s3.putObject({
      Bucket: bucket,
      Key: `01-${objectKey}`,
      Body: objectBody,
    });
    await s3.putObject({
      Bucket: bucket,
      Key: `02-${objectKey}`,
      Body: objectBody,
    });

    expect(await getNumberOfObjects(bucket)).toBe(2);

    const { Contents } = await s3.listObjects({ Bucket: bucket });
    await s3.deleteObjects({
      Bucket: bucket,
      Delete: { Objects: Contents?.map(({ Key }) => ({ Key })) },
    });

    expect(await getNumberOfObjects(bucket)).toBe(0);
  });

  test("Copy object", async () => {
    await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

    expect(await getNumberOfObjects(bucket)).toBe(1);

    const targetKey = `subdir/${objectKey}`;
    await s3.copyObject({
      Bucket: bucket,
      CopySource: `/${bucket}/${objectKey}`,
      Key: targetKey,
    });

    expect(await getNumberOfObjects(bucket)).toBe(2);

    const body = await s3
      .getObject({ Bucket: bucket, Key: targetKey })
      .then(({ Body }) => Body?.transformToString());

    expect(body).toBe(objectBody);
  });

  test("deleteAllObjects() helper", async () => {
    await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

    expect(await getNumberOfObjects(bucket)).toBe(1);

    await s3.deleteAllObjects(bucket);

    expect(await getNumberOfObjects(bucket)).toBe(0);
  });
});

describe("Signed URLs", () => {
  beforeAll(async () => {
    await s3.deleteBucketsByPrefix(bucket);
    await s3.createBucket({ Bucket: bucket });
  });

  beforeEach(async () => {
    await s3.deleteAllObjects(bucket);
  });

  afterAll(async () => {
    await s3.deleteBucketsByPrefix(bucket);
  });

  test("Put object via signed URL", async () => {
    const signedUrl = await s3.putObjectUrl({
      Bucket: bucket,
      Key: objectKey,
      Body: objectBody,
    });
    const { pathname, query } = url.parse(signedUrl, true);

    expect(pathname?.endsWith(`/${objectKey}`)).toBe(true);
    expect(query["x-id"]).toBe("PutObject");

    if (isLocal) {
      // LocalStack will crash for some reasons.
      return;
    }
    const res = await axios(signedUrl, { method: "put", data: objectBody });

    expect(res.status).toBe(200);

    const body = await s3
      .getObject({ Bucket: bucket, Key: objectKey })
      .then(({ Body }) => Body?.transformToString());

    expect(body).toBe(objectBody);
  });

  test("Get object via signed URL", async () => {
    await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });
    const signedUrl = await s3.getObjectUrl({ Bucket: bucket, Key: objectKey });
    const { pathname, query } = url.parse(signedUrl, true);

    expect(pathname?.endsWith(`/${objectKey}`)).toBe(true);
    expect(query["x-id"]).toBe("GetObject");

    const { data } = await axios(signedUrl);

    expect(data).toBe(objectBody);
  });
});
