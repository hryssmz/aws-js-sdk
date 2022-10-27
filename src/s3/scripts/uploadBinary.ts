// src/scripts/uploadBinary.ts
import { createReadStream } from "node:fs";
import { S3Wrapper } from "..";
import { binaryPath, binaryKey, bucket } from "./args";

async function main() {
  const s3 = new S3Wrapper();
  await s3.putObject({
    Bucket: bucket,
    Key: binaryKey,
    Body: createReadStream(binaryPath),
  });
  return binaryKey;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
