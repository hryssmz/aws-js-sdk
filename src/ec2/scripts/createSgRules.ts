// ec2/scripts/createSgRules.ts
import { EC2Wrapper } from "..";
import { ipIngress, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const { SecurityGroupRules } = await ec2.authorizeSecurityGroupIngress({
    GroupName: sgName,
    IpPermissions: ipIngress,
  });
  return JSON.stringify(SecurityGroupRules, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
