// ec2/scripts/deleteSecurityGroup.ts
import { EC2Wrapper } from "..";
import { sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  await ec2.deleteSecurityGroup({ GroupName: sgName });
  return sgName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
