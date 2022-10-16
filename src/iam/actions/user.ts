// iam/actions/user.ts
import {
  CreateAccessKeyCommand,
  CreateUserCommand,
  DeleteAccessKeyCommand,
  DeleteUserCommand,
  GetUserCommand,
  ListAccessKeysCommand,
  ListUsersCommand,
  UpdateUserCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "../utils";
import type {
  IAMClientConfig,
  CreateAccessKeyCommandInput,
  CreateUserCommandInput,
  DeleteAccessKeyCommandInput,
  DeleteUserCommandInput,
  GetUserCommandInput,
  ListAccessKeysCommandInput,
  ListUsersCommandInput,
  UpdateUserCommandInput,
} from "@aws-sdk/client-iam";

export const createAccessKey = async (
  params: CreateAccessKeyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new CreateAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const createUser = async (
  params: CreateUserCommandInput & { Path: string },
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new CreateUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAccessKey = async (
  params: DeleteAccessKeyCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DeleteAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteUser = async (
  params: DeleteUserCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DeleteUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const getUser = async (
  params: GetUserCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new GetUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAccessKeys = async (
  params: ListAccessKeysCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListAccessKeysCommand(params);
  const result = await client.send(command);
  return result;
};

export const listUsers = async (
  params: ListUsersCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListUsersCommand(params);
  const result = await client.send(command);
  return result;
};

export const updateUser = async (
  params: UpdateUserCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new UpdateUserCommand(params);
  const result = await client.send(command);
  return result;
};
