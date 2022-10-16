// iam/actions/userPolicy.ts
import {
  AttachUserPolicyCommand,
  DeleteUserPolicyCommand,
  DetachUserPolicyCommand,
  ListAttachedUserPoliciesCommand,
  ListUserPoliciesCommand,
  PutUserPolicyCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "../utils";
import type {
  IAMClientConfig,
  AttachUserPolicyCommandInput,
  DeleteUserPolicyCommandInput,
  DetachUserPolicyCommandInput,
  ListAttachedUserPoliciesCommandInput,
  ListUserPoliciesCommandInput,
  PutUserPolicyCommandInput,
} from "@aws-sdk/client-iam";

export const attachUserPolicy = async (
  params: AttachUserPolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new AttachUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteUserPolicy = async (
  params: DeleteUserPolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DeleteUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const detachUserPolicy = async (
  params: DetachUserPolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DetachUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAttachedUserPolicies = async (
  params: ListAttachedUserPoliciesCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListAttachedUserPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listUserPolicies = async (
  params: ListUserPoliciesCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListUserPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const putUserPolicy = async (
  params: PutUserPolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new PutUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};
