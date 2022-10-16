// iam/actions/role.ts
import {
  CreateRoleCommand,
  DeleteRoleCommand,
  GetRoleCommand,
  ListRolesCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "../utils";
import type {
  IAMClientConfig,
  CreateRoleCommandInput,
  DeleteRoleCommandInput,
  GetRoleCommandInput,
  ListRolesCommandInput,
} from "@aws-sdk/client-iam";

export const createRole = async (
  params: CreateRoleCommandInput & { Path: string },
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new CreateRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRole = async (
  params: DeleteRoleCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DeleteRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const getRole = async (
  params: GetRoleCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new GetRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const listRoles = async (
  params: ListRolesCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListRolesCommand(params);
  const result = await client.send(command);
  return result;
};
