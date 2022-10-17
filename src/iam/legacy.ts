// iam/actions/legacy.ts
import {
  IAMClient,
  AttachRolePolicyCommand,
  AttachUserPolicyCommand,
  CreateAccessKeyCommand,
  CreateAccountAliasCommand,
  CreateGroupCommand,
  CreatePolicyCommand,
  CreatePolicyVersionCommand,
  CreateRoleCommand,
  CreateUserCommand,
  DeleteAccessKeyCommand,
  DeleteAccountAliasCommand,
  DeleteGroupCommand,
  DeletePolicyCommand,
  DeletePolicyVersionCommand,
  DeleteRoleCommand,
  DeleteRolePolicyCommand,
  DeleteUserCommand,
  DeleteUserPolicyCommand,
  DetachRolePolicyCommand,
  DetachUserPolicyCommand,
  GenerateCredentialReportCommand,
  GetAccessKeyLastUsedCommand,
  GetAccountAuthorizationDetailsCommand,
  GetAccountSummaryCommand,
  GetCredentialReportCommand,
  GetGroupCommand,
  GetPolicyCommand,
  GetPolicyVersionCommand,
  GetRoleCommand,
  GetUserCommand,
  ListAccessKeysCommand,
  ListAccountAliasesCommand,
  ListAttachedRolePoliciesCommand,
  ListAttachedUserPoliciesCommand,
  ListGroupsCommand,
  ListPoliciesCommand,
  ListPolicyVersionsCommand,
  ListRolePoliciesCommand,
  ListRolesCommand,
  ListUserPoliciesCommand,
  ListUsersCommand,
  PutRolePolicyCommand,
  PutUserPolicyCommand,
  SetDefaultPolicyVersionCommand,
  UpdateAccessKeyCommand,
  UpdateUserCommand,
} from "@aws-sdk/client-iam";
import { defaultIAMClientConfig } from "./wrapper";
import type {
  IAMClientConfig,
  AttachRolePolicyCommandInput,
  AttachUserPolicyCommandInput,
  CreateAccessKeyCommandInput,
  CreateAccountAliasCommandInput,
  CreateGroupCommandInput,
  CreatePolicyCommandInput,
  CreatePolicyVersionCommandInput,
  CreateRoleCommandInput,
  CreateUserCommandInput,
  DeleteAccessKeyCommandInput,
  DeleteAccountAliasCommandInput,
  DeleteGroupCommandInput,
  DeletePolicyCommandInput,
  DeletePolicyVersionCommandInput,
  DeleteRoleCommandInput,
  DeleteRolePolicyCommandInput,
  DeleteUserCommandInput,
  DeleteUserPolicyCommandInput,
  DetachRolePolicyCommandInput,
  DetachUserPolicyCommandInput,
  GenerateCredentialReportCommandInput,
  GetAccessKeyLastUsedCommandInput,
  GetAccountAuthorizationDetailsCommandInput,
  GetAccountSummaryCommandInput,
  GetCredentialReportCommandInput,
  GetGroupCommandInput,
  GetPolicyCommandInput,
  GetPolicyVersionCommandInput,
  GetRoleCommandInput,
  GetUserCommandInput,
  ListAccessKeysCommandInput,
  ListAccountAliasesCommandInput,
  ListAttachedRolePoliciesCommandInput,
  ListAttachedUserPoliciesCommandInput,
  ListGroupsCommandInput,
  ListPoliciesCommandInput,
  ListPolicyVersionsCommandInput,
  ListRolePoliciesCommandInput,
  ListRolesCommandInput,
  ListUserPoliciesCommandInput,
  ListUsersCommandInput,
  PutRolePolicyCommandInput,
  PutUserPolicyCommandInput,
  SetDefaultPolicyVersionCommandInput,
  UpdateAccessKeyCommandInput,
  UpdateUserCommandInput,
} from "@aws-sdk/client-iam";

export const iamClient = (config?: IAMClientConfig) => {
  return new IAMClient({ ...defaultIAMClientConfig, ...config });
};

export const attachRolePolicy = async (
  params: AttachRolePolicyCommandInput,
  client = iamClient()
) => {
  const command = new AttachRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const attachUserPolicy = async (
  params: AttachUserPolicyCommandInput,
  client = iamClient()
) => {
  const command = new AttachUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const createAccessKey = async (
  params: CreateAccessKeyCommandInput,
  client = iamClient()
) => {
  const command = new CreateAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const createAccountAlias = async (
  params: CreateAccountAliasCommandInput,
  client = iamClient()
) => {
  const command = new CreateAccountAliasCommand(params);
  const result = await client.send(command);
  return result;
};

export const createGroup = async (
  params: CreateGroupCommandInput & { Path: string },
  client = iamClient()
) => {
  const command = new CreateGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const createPolicy = async (
  params: CreatePolicyCommandInput & { Path: string },
  client = iamClient()
) => {
  const command = new CreatePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const createPolicyVersion = async (
  params: CreatePolicyVersionCommandInput,
  client = iamClient()
) => {
  const command = new CreatePolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const createRole = async (
  params: CreateRoleCommandInput & { Path: string },
  client = iamClient()
) => {
  const command = new CreateRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const createUser = async (
  params: CreateUserCommandInput & { Path: string },
  client = iamClient()
) => {
  const command = new CreateUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAccessKey = async (
  params: DeleteAccessKeyCommandInput,
  client = iamClient()
) => {
  const command = new DeleteAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAccountAlias = async (
  params: DeleteAccountAliasCommandInput,
  client = iamClient()
) => {
  const command = new DeleteAccountAliasCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteGroup = async (
  params: DeleteGroupCommandInput,
  client = iamClient()
) => {
  const command = new DeleteGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const deletePolicy = async (
  params: DeletePolicyCommandInput,
  client = iamClient()
) => {
  const command = new DeletePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deletePolicyVersion = async (
  params: DeletePolicyVersionCommandInput,
  client = iamClient()
) => {
  const command = new DeletePolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRole = async (
  params: DeleteRoleCommandInput,
  client = iamClient()
) => {
  const command = new DeleteRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRolePolicy = async (
  params: DeleteRolePolicyCommandInput,
  client = iamClient()
) => {
  const command = new DeleteRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteUser = async (
  params: DeleteUserCommandInput,
  client = iamClient()
) => {
  const command = new DeleteUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteUserPolicy = async (
  params: DeleteUserPolicyCommandInput,
  client = iamClient()
) => {
  const command = new DeleteUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const detachRolePolicy = async (
  params: DetachRolePolicyCommandInput,
  client = iamClient()
) => {
  const command = new DetachRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const detachUserPolicy = async (
  params: DetachUserPolicyCommandInput,
  client = iamClient()
) => {
  const command = new DetachUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const generateCredentialReport = async (
  params: GenerateCredentialReportCommandInput,
  client = iamClient()
) => {
  const command = new GenerateCredentialReportCommand(params);
  const result = await client.send(command);
  return result;
};

export const getAccessKeyLastUsed = async (
  params: GetAccessKeyLastUsedCommandInput,
  client = iamClient()
) => {
  const command = new GetAccessKeyLastUsedCommand(params);
  const result = await client.send(command);
  return result;
};

export const getAccountAuthorizationDetails = async (
  params: GetAccountAuthorizationDetailsCommandInput,
  client = iamClient()
) => {
  const command = new GetAccountAuthorizationDetailsCommand(params);
  const result = await client.send(command);
  return result;
};

export const getAccountSummary = async (
  params: GetAccountSummaryCommandInput,
  client = iamClient()
) => {
  const command = new GetAccountSummaryCommand(params);
  const result = await client.send(command);
  return result;
};

export const getCredentialReport = async (
  params: GetCredentialReportCommandInput,
  client = iamClient()
) => {
  const command = new GetCredentialReportCommand(params);
  const result = await client.send(command);
  return result;
};

export const getGroup = async (
  params: GetGroupCommandInput,
  client = iamClient()
) => {
  const command = new GetGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const getPolicy = async (
  params: GetPolicyCommandInput,
  client = iamClient()
) => {
  const command = new GetPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const getPolicyVersion = async (
  params: GetPolicyVersionCommandInput,
  client = iamClient()
) => {
  const command = new GetPolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const getRole = async (
  params: GetRoleCommandInput,
  client = iamClient()
) => {
  const command = new GetRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const getUser = async (
  params: GetUserCommandInput,
  client = iamClient()
) => {
  const command = new GetUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAccessKeys = async (
  params: ListAccessKeysCommandInput,
  client = iamClient()
) => {
  const command = new ListAccessKeysCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAccountAliases = async (
  params: ListAccountAliasesCommandInput,
  client = iamClient()
) => {
  const command = new ListAccountAliasesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAttachedRolePolicies = async (
  params: ListAttachedRolePoliciesCommandInput,
  client = iamClient()
) => {
  const command = new ListAttachedRolePoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAttachedUserPolicies = async (
  params: ListAttachedUserPoliciesCommandInput,
  client = iamClient()
) => {
  const command = new ListAttachedUserPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listGroups = async (
  params: ListGroupsCommandInput,
  client = iamClient()
) => {
  const command = new ListGroupsCommand(params);
  const result = await client.send(command);
  return result;
};

export const listPolicies = async (
  params: ListPoliciesCommandInput,
  client = iamClient()
) => {
  const command = new ListPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listPolicyVersions = async (
  params: ListPolicyVersionsCommandInput,
  client = iamClient()
) => {
  const command = new ListPolicyVersionsCommand(params);
  const result = await client.send(command);
  return result;
};

export const listRolePolicies = async (
  params: ListRolePoliciesCommandInput,
  client = iamClient()
) => {
  const command = new ListRolePoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listRoles = async (
  params: ListRolesCommandInput,
  client = iamClient()
) => {
  const command = new ListRolesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listUserPolicies = async (
  params: ListUserPoliciesCommandInput,
  client = iamClient()
) => {
  const command = new ListUserPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listUsers = async (
  params: ListUsersCommandInput,
  client = iamClient()
) => {
  const command = new ListUsersCommand(params);
  const result = await client.send(command);
  return result;
};

export const putRolePolicy = async (
  params: PutRolePolicyCommandInput,
  client = iamClient()
) => {
  const command = new PutRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const putUserPolicy = async (
  params: PutUserPolicyCommandInput,
  client = iamClient()
) => {
  const command = new PutUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const setDefaultPolicyVersion = async (
  params: SetDefaultPolicyVersionCommandInput,
  client = iamClient()
) => {
  const command = new SetDefaultPolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const updateAccessKey = async (
  params: UpdateAccessKeyCommandInput,
  client = iamClient()
) => {
  const command = new UpdateAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const updateUser = async (
  params: UpdateUserCommandInput,
  client = iamClient()
) => {
  const command = new UpdateUserCommand(params);
  const result = await client.send(command);
  return result;
};
