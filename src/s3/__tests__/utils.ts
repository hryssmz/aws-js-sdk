// s3/actions/__tests__/utils.ts
import { S3Wrapper } from "..";

export const deleteAllObjects = async (
  bucket?: string,
  s3 = new S3Wrapper()
) => {
  const { Contents: objects } = await s3.listObjects({ Bucket: bucket });
  if (objects === undefined) {
    return;
  }
  const result = await s3.deleteObjects({
    Bucket: bucket,
    Delete: { Objects: objects.map(object => ({ Key: object.Key })) },
  });
  return result;
};

export const deleteDummyBuckets = async (s3 = new S3Wrapper()) => {
  const { Buckets: buckets } = await s3.listBuckets({});
  const promises =
    buckets
      ?.filter(bucket => bucket.Name?.startsWith("dummy"))
      .map(async bucket => {
        await deleteAllObjects(bucket.Name, s3);
        const result = await s3.deleteBucket({ Bucket: bucket.Name });
        return result;
      }) || [];
  const results = await Promise.all(promises);
  return results;
};
