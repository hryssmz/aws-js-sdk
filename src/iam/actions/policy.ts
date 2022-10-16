// iam/actions/policy.ts
import {
  CreatePolicyCommand,
  DeletePolicyCommand,
  GetPolicyCommand,
  ListPoliciesCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "../utils";
import type {
  IAMClientConfig,
  CreatePolicyCommandInput,
  DeletePolicyCommandInput,
  GetPolicyCommandInput,
  ListPoliciesCommandInput,
} from "@aws-sdk/client-iam";

export const createPolicy = async (
  params: CreatePolicyCommandInput & { Path: string },
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new CreatePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deletePolicy = async (
  params: DeletePolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DeletePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const getPolicy = async (
  params: GetPolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new GetPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const listPolicies = async (
  params: ListPoliciesCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};
