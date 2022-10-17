// sts/actions/legacy.ts
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { defaultSTSClientConfig } from "./wrapper";
import type {
  STSClientConfig,
  AssumeRoleCommandInput,
} from "@aws-sdk/client-sts";

export const stsClient = (config?: STSClientConfig) => {
  return new STSClient({ ...defaultSTSClientConfig, ...config });
};

export const assumeRole = async (
  params: AssumeRoleCommandInput,
  client = stsClient()
) => {
  const command = new AssumeRoleCommand(params);
  const result = await client.send(command);
  return result;
};
