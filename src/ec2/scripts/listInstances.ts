// ec2/scripts/listInstances.ts
import type { Instance } from "@aws-sdk/client-ec2";
import { EC2Wrapper } from "..";

async function main() {
  const ec2 = new EC2Wrapper();
  const { Reservations } = await ec2.describeInstances({});
  const instances =
    Reservations?.reduce(
      (acc, { Instances }) => [...acc, ...(Instances ?? [])],
      [] as Instance[]
    ) ?? [];
  const results = instances
    .map(({ InstanceId, State, PublicIpAddress }) => ({
      InstanceId,
      State: State?.Name,
      PublicIpAddress,
    }))
    .filter(({ State }) => State !== "terminated");
  return JSON.stringify(results, null, 2);
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
