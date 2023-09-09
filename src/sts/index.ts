// sts/index.ts
import {
  STSClient,
  AssumeRoleCommand,
  AssumeRoleWithWebIdentityCommand,
  GetCallerIdentityCommand,
} from "@aws-sdk/client-sts";
import { defaultClientConfig } from "../utils";
import type {
  STSClientConfig,
  AssumeRoleCommandInput,
  AssumeRoleWithWebIdentityCommandInput,
  GetCallerIdentityCommandInput,
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

  async assumeRoleWithWebIdentity(
    params: AssumeRoleWithWebIdentityCommandInput
  ) {
    const command = new AssumeRoleWithWebIdentityCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getCallerIdentity(params: GetCallerIdentityCommandInput) {
    const command = new GetCallerIdentityCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
