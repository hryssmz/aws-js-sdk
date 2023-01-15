// secretsmanager/index.ts
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { defaultClientConfig } from "../utils";
import type {
  GetSecretValueCommandInput,
  SecretsManagerClientConfig,
} from "@aws-sdk/client-secrets-manager";

export const defaultSecretsManagerConfig = {
  ...defaultClientConfig,
};

export class SecretsManagerWrapper {
  client: SecretsManagerClient;

  constructor(config?: SecretsManagerClientConfig) {
    this.client = new SecretsManagerClient({
      ...defaultSecretsManagerConfig,
      ...config,
    });
  }

  async getSecretValue(params: GetSecretValueCommandInput) {
    const command = new GetSecretValueCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
