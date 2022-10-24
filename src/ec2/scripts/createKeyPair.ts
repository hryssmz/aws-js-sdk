// ec2/scripts/createKeyPair.ts
import { chmod, writeFile } from "node:fs/promises";
import { EC2Wrapper } from "..";
import { keyPairName, keyPairPath } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const { KeyMaterial } = await ec2.createKeyPair({ KeyName: keyPairName });
  if (KeyMaterial !== undefined) {
    await writeFile(keyPairPath, KeyMaterial);
    await chmod(keyPairPath, 0o400);
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
