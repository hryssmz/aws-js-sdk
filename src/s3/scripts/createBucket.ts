// s3/scripts/createBucket.ts
import { S3Wrapper } from "..";
import { bucket } from "./args";

async function main() {
  const s3 = new S3Wrapper();
  await s3.createBucket({ Bucket: bucket });
  return bucket;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
