// s3/scripts/uploadPlain.ts
import { S3Wrapper } from "..";
import { bucket, objectKey, objectBody } from "./args";

async function main() {
  const s3 = new S3Wrapper();
  await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });
  return objectKey;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
