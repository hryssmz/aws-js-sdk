// secretsmanager/actions.ts
import { SecretsManagerWrapper } from ".";
import type { Action } from "../utils";

const secretName = "MySecret";

async function getSecretValue() {
  const secretsManager = new SecretsManagerWrapper();
  const { SecretString } = await secretsManager.getSecretValue({
    SecretId: secretName,
    VersionStage: "AWSCURRENT",
  });
  const result = JSON.parse(SecretString ?? "{}");
  return JSON.stringify(result, null, 2);
}

const actions: Record<string, Action> = {
  getSecretValue,
};

export default actions;
