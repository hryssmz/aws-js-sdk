// sts/actions/index.ts
import { AssumeRoleCommand } from "@aws-sdk/client-sts";
import { stsClient } from "../utils";
import type {
  STSClientConfig,
  AssumeRoleCommandInput,
} from "@aws-sdk/client-sts";

export const assumeRole = async (
  params: AssumeRoleCommandInput,
  clientConfig?: STSClientConfig
) => {
  const client = stsClient(clientConfig);
  const command = new AssumeRoleCommand(params);
  const result = await client.send(command);
  return result;
};
