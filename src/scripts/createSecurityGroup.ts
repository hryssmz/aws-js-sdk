// scripts/createSecurityGroup.ts
import { EC2Wrapper } from "../ec2";
import { sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  await ec2.createSecurityGroup({
    GroupName: sgName,
    Description: "My security group",
  });
  return sgName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
