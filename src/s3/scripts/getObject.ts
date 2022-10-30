// s3/scripts/getObject.ts
import { S3Wrapper } from "..";
import { bucket, objectKey } from "./args";

async function main() {
  const s3 = new S3Wrapper();
  const { Body } = await s3.getObject({ Bucket: bucket, Key: objectKey });
  const content = Body?.transformToString();
  return content;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
