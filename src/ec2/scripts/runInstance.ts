// ec2/scripts/runInstance.ts
import { EC2Wrapper } from "..";
import { keyPairName, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const { Instances } = await ec2.runInstances({
    MaxCount: 1,
    MinCount: 1,
    ImageId: "ami-0de5311b2a443fb89",
    KeyName: keyPairName,
    InstanceType: "t2.micro",
    SecurityGroups: [sgName],
  });
  const results = Instances?.map(
    ({ ImageId, InstanceId, KeyName, PrivateDnsName }) => ({
      ImageId,
      InstanceId,
      KeyName,
      PrivateDnsName,
    })
  );
  return JSON.stringify(results, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
