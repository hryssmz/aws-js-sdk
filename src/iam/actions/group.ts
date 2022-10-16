// iam/actions/group.ts
import {
  CreateGroupCommand,
  DeleteGroupCommand,
  GetGroupCommand,
  ListGroupsCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "../utils";
import type {
  IAMClientConfig,
  CreateGroupCommandInput,
  DeleteGroupCommandInput,
  GetGroupCommandInput,
  ListGroupsCommandInput,
} from "@aws-sdk/client-iam";

export const createGroup = async (
  params: CreateGroupCommandInput & { Path: string },
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new CreateGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteGroup = async (
  params: DeleteGroupCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new DeleteGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const getGroup = async (
  params: GetGroupCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new GetGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const listGroups = async (
  params: ListGroupsCommandInput,
  clientConfig?: IAMClientConfig
) => {
  const client = iamClient(clientConfig);
  const command = new ListGroupsCommand(params);
  const result = await client.send(command);
  return result;
};
