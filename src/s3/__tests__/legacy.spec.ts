// iam/actions/__tests__/legacy.spec.ts
import {
  createBucket,
  deleteBucket,
  deleteObject,
  deleteObjects,
  getObject,
  listBuckets,
  listObjects,
  putObject,
} from "../legacy";
import { bucket, objectKey, objectBody } from "./dummy";
import { deleteAllObjects, deleteDummyBuckets } from "./utils";

describe("Bucket APIs", () => {
  beforeEach(async () => {
    await deleteDummyBuckets();
  });

  afterAll(async () => {
    await deleteDummyBuckets();
  });

  test("Create, list, and delete bucket", async () => {
    const listDummyBuckets = async () => {
      const { Buckets: buckets } = await listBuckets({});
      const dummyBuckets = buckets?.filter(bucket =>
        bucket.Name?.startsWith("dummy")
      );
      return dummyBuckets;
    };

    expect(await listDummyBuckets()).toHaveLength(0);

    const { Location: location } = await createBucket({ Bucket: bucket });

    expect(await listDummyBuckets()).toHaveLength(1);
    expect(location).toStrictEqual(expect.stringContaining(bucket));

    await deleteBucket({ Bucket: bucket });

    expect(await listDummyBuckets()).toHaveLength(0);
  });
});

describe("Object APIs", () => {
  beforeAll(async () => {
    await deleteDummyBuckets();
    await createBucket({ Bucket: bucket });
  });

  beforeEach(async () => {
    await deleteAllObjects(bucket);
  });

  afterAll(async () => {
    await deleteDummyBuckets();
  });

  test("Upload, get, list and delete object", async () => {
    const listCurrentObjects = async () => {
      const { Contents: objects } = await listObjects({ Bucket: bucket });
      return objects;
    };

    expect(await listCurrentObjects()).toBeUndefined();

    await putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });

    expect(await listCurrentObjects()).toHaveLength(1);

    const body = await getObject({ Bucket: bucket, Key: objectKey }).then(
      ({ Body }) => Body?.transformToString()
    );

    expect(body).toBe(objectBody);

    await deleteObject({ Bucket: bucket, Key: objectKey });

    expect(await listCurrentObjects()).toBeUndefined();
  });

  test("Delete all objects", async () => {
    const listCurrentObjects = async () => {
      const { Contents: objects } = await listObjects({ Bucket: bucket });
      return objects;
    };

    expect(await listCurrentObjects()).toBeUndefined();

    await putObject({
      Bucket: bucket,
      Key: `01-${objectKey}`,
      Body: objectBody,
    });
    await putObject({
      Bucket: bucket,
      Key: `02-${objectKey}`,
      Body: objectBody,
    });
    const objects = await listCurrentObjects();

    expect(objects).toHaveLength(2);

    await deleteObjects({
      Bucket: bucket,
      Delete: { Objects: objects?.map(object => ({ Key: object.Key })) },
    });

    expect(await listCurrentObjects()).toBeUndefined();
  });
});
