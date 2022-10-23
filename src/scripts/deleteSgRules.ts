// scripts/deleteSgRules.ts
import { EC2Wrapper } from "../ec2";
import { cidrIp, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  await ec2.revokeSecurityGroupIngress({
    GroupName: sgName,
    IpPermissions: [
      {
        FromPort: 22,
        ToPort: 22,
        IpProtocol: "tcp",
        IpRanges: [{ CidrIp: cidrIp }],
      },
    ],
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
