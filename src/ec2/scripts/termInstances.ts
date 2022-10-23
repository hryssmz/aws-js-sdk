// ec2/scripts/termInstances.ts
import { EC2Wrapper } from "..";
import { keyPairName, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const instances = await ec2.listInstances(keyPairName, sgName);
  const InstanceIds = instances.map(({ InstanceId }) => InstanceId ?? "");
  await ec2.terminateInstances({ InstanceIds });
  return JSON.stringify(InstanceIds, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
