// sts/index.ts
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { defaultClientConfig } from "../utils";
import type {
  STSClientConfig,
  AssumeRoleCommandInput,
} from "@aws-sdk/client-sts";

export const defaultSTSClientConfig = {
  ...defaultClientConfig,
};

export class STSWrapper {
  client: STSClient;

  constructor(config?: STSClientConfig) {
    this.client = new STSClient({ ...defaultSTSClientConfig, ...config });
  }

  async assumeRole(params: AssumeRoleCommandInput) {
    const command = new AssumeRoleCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
