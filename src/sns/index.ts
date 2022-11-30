// sns/index.ts
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { defaultClientConfig } from "../utils";
import type { PublishCommandInput, SNSClientConfig } from "@aws-sdk/client-sns";

export const defaultSNSClientConfig = {
  ...defaultClientConfig,
};

export class SNSWrapper {
  client: SNSClient;

  constructor(config?: SNSClientConfig) {
    this.client = new SNSClient({ ...defaultSNSClientConfig, ...config });
  }

  async publish(params: PublishCommandInput) {
    const command = new PublishCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
