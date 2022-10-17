// s3/actions/__test__/wrapper.spec.ts
import { S3Wrapper } from "../wrapper";
import { bucket, objectKey, objectBody } from "./dummy";
import { deleteAllObjects, deleteDummyBuckets } from "./utils";

describe("Bucket APIs", () => {
  const s3 = new S3Wrapper();

  beforeEach(async () => {
    await deleteDummyBuckets();
  });

  afterAll(async () => {
    await deleteDummyBuckets();
  });

  test("Create, list, and delete bucket", async () => {
    const listDummyBuckets = async () => {
      const { Buckets: buckets } = await s3.listBuckets({});
      const dummyBuckets = buckets?.filter(bucket =>
        bucket.Name?.startsWith("dummy")
      );
      return dummyBuckets;
    };

    expect(await listDummyBuckets()).toHaveLength(0);

    const { Location: location } = await s3.createBucket({ Bucket: bucket });

    expect(await listDummyBuckets()).toHaveLength(1);
    expect(location).toStrictEqual(expect.stringContaining(bucket));

    await s3.deleteBucket({ Bucket: bucket });

    expect(await listDummyBuckets()).toHaveLength(0);
  });
});

describe("Object APIs", () => {
  const s3 = new S3Wrapper();

  beforeAll(async () => {
    await deleteDummyBuckets();
    await s3.createBucket({ Bucket: bucket });
  });

  beforeEach(async () => {
    await deleteAllObjects(bucket);
  });

  afterAll(async () => {
    await deleteDummyBuckets();
  });

  test("Upload, get, list and delete object", async () => {
    const listCurrentObjects = async () => {
      const { Contents: objects } = await s3.listObjects({ Bucket: bucket });
      return objects;
    };

    expect(await listCurrentObjects()).toBeUndefined();

    await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

    expect(await listCurrentObjects()).toHaveLength(1);

    const body = await s3
      .getObject({ Bucket: bucket, Key: objectKey })
      .then(({ Body }) => Body?.transformToString());

    expect(body).toBe(objectBody);

    await s3.deleteObject({ Bucket: bucket, Key: objectKey });

    expect(await listCurrentObjects()).toBeUndefined();
  });

  test("Delete all objects", async () => {
    const listCurrentObjects = async () => {
      const { Contents: objects } = await s3.listObjects({ Bucket: bucket });
      return objects;
    };

    expect(await listCurrentObjects()).toBeUndefined();

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
    const objects = await listCurrentObjects();

    expect(objects).toHaveLength(2);

    await s3.deleteObjects({
      Bucket: bucket,
      Delete: { Objects: objects?.map(object => ({ Key: object.Key })) },
    });

    expect(await listCurrentObjects()).toBeUndefined();
  });
});
