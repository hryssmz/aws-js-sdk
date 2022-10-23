// ec2/scripts/deleteKeyPair.ts
import { rm } from "node:fs/promises";
import { EC2Wrapper } from "..";
import { keyPairName, keyPairPath } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  await ec2.deleteKeyPair({ KeyName: keyPairName });
  await rm(keyPairPath, { force: true });
  return keyPairName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
