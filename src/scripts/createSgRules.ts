// scripts/createSgRules.ts
import { EC2Wrapper } from "../ec2";
import { cidrIp, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const { SecurityGroupRules } = await ec2.authorizeSecurityGroupIngress({
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
  return JSON.stringify(SecurityGroupRules, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
