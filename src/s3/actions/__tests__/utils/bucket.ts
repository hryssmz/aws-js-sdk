// s3/actions/__tests__/utils/bucket.ts
import { deleteBucket, listBuckets } from "../../bucket";

export const deleteDummyBuckets = async () => {
  const { Buckets: buckets } = await listBuckets({});
  const promises =
    buckets
      ?.filter(bucket => bucket.Name?.startsWith("dummy"))
      .map(bucket => deleteBucket({ Bucket: bucket.Name })) || [];
  const results = await Promise.all(promises);
  return results;
};
