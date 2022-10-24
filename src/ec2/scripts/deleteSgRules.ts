// ec2/scripts/deleteSgRules.ts
import { EC2Wrapper } from "..";
import { ipIngress, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  await ec2.revokeSecurityGroupIngress({
    GroupName: sgName,
    IpPermissions: ipIngress,
  });
  await ec2.deleteAllSecurityGroupRules(sgName);
  return sgName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
