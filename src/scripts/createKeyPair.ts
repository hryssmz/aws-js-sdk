// scripts/createKeyPair.ts
import { writeFile } from "node:fs/promises";
import { EC2Wrapper } from "../ec2";
import { keyPairName, keyPairPath } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const { KeyMaterial } = await ec2.createKeyPair({ KeyName: keyPairName });
  if (KeyMaterial !== undefined) {
    await writeFile(keyPairPath, KeyMaterial);
  }
  return keyPairName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
