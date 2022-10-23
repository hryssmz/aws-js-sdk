// scripts/listInstances.ts
import { EC2Wrapper } from "../ec2";
import { keyPairName, sgName } from "./args";

async function main() {
  const ec2 = new EC2Wrapper();
  const instances = await ec2.listInstances(keyPairName, sgName);
  const results = instances.map(({ InstanceId, State, PublicIpAddress }) => ({
    InstanceId,
    State: State?.Name,
    PublicIpAddress,
  }));
  return JSON.stringify(results, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
