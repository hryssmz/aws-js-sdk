// scripts/connectInstance.ts
import { NodeSSH } from "node-ssh";
import { EC2Wrapper } from "../ec2";
import { ec2User, keyPairName, keyPairPath, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const ssh = new NodeSSH();
  const instances = await ec2.listInstances(keyPairName, sgName);
  const instance = instances[0];
  const publicIp = instance.PublicIpAddress;
  const result = await ssh
    .connect({
      host: publicIp,
      username: ec2User,
      privateKeyPath: keyPairPath,
    })
    .then(() => ssh.exec("hostname", []))
    .finally(() => ssh.dispose());
  console.log(new Date());
  return result;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
