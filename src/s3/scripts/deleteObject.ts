// s3/scripts/deleteObject.ts
import { S3Wrapper } from "..";
import { bucket, objectKey } from "./args";

async function main() {
  const s3 = new S3Wrapper();
  await s3.deleteObject({ Bucket: bucket, Key: objectKey });
  return objectKey;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
