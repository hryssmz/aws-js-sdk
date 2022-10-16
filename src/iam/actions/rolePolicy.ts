// iam/actions/rolePolicy.ts
import {
  AttachRolePolicyCommand,
  DeleteRolePolicyCommand,
  DetachRolePolicyCommand,
  ListAttachedRolePoliciesCommand,
  ListRolePoliciesCommand,
  PutRolePolicyCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "../utils";
import type {
  IAMClientConfig,
  AttachRolePolicyCommandInput,
  DeleteRolePolicyCommandInput,
  DetachRolePolicyCommandInput,
  ListAttachedRolePoliciesCommandInput,
  ListRolePoliciesCommandInput,
  PutRolePolicyCommandInput,
} from "@aws-sdk/client-iam";

export const attachRolePolicy = async (
  params: AttachRolePolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new AttachRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRolePolicy = async (
  params: DeleteRolePolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DeleteRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const detachRolePolicy = async (
  params: DetachRolePolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DetachRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAttachedRolePolicies = async (
  params: ListAttachedRolePoliciesCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListAttachedRolePoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listRolePolicies = async (
  params: ListRolePoliciesCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListRolePoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const putRolePolicy = async (
  params: PutRolePolicyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new PutRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};
