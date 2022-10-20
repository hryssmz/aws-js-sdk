// iam/legacy.ts
import {
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
  IAMClient,
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
  IAMClientConfig,
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

export const createIAMClient = (config?: IAMClientConfig) => {
  return new IAMClient({ ...defaultIAMClientConfig, ...config });
};

export const attachRolePolicy = async (
  params: AttachRolePolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new AttachRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const attachUserPolicy = async (
  params: AttachUserPolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new AttachUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const createAccessKey = async (
  params: CreateAccessKeyCommandInput,
  client = createIAMClient()
) => {
  const command = new CreateAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const createAccountAlias = async (
  params: CreateAccountAliasCommandInput,
  client = createIAMClient()
) => {
  const command = new CreateAccountAliasCommand(params);
  const result = await client.send(command);
  return result;
};

export const createGroup = async (
  params: CreateGroupCommandInput,
  client = createIAMClient()
) => {
  const command = new CreateGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const createPolicy = async (
  params: CreatePolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new CreatePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const createPolicyVersion = async (
  params: CreatePolicyVersionCommandInput,
  client = createIAMClient()
) => {
  const command = new CreatePolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const createRole = async (
  params: CreateRoleCommandInput,
  client = createIAMClient()
) => {
  const command = new CreateRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const createUser = async (
  params: CreateUserCommandInput,
  client = createIAMClient()
) => {
  const command = new CreateUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAccessKey = async (
  params: DeleteAccessKeyCommandInput,
  client = createIAMClient()
) => {
  const command = new DeleteAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAccountAlias = async (
  params: DeleteAccountAliasCommandInput,
  client = createIAMClient()
) => {
  const command = new DeleteAccountAliasCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteGroup = async (
  params: DeleteGroupCommandInput,
  client = createIAMClient()
) => {
  const command = new DeleteGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const deletePolicy = async (
  params: DeletePolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new DeletePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deletePolicyVersion = async (
  params: DeletePolicyVersionCommandInput,
  client = createIAMClient()
) => {
  const command = new DeletePolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRole = async (
  params: DeleteRoleCommandInput,
  client = createIAMClient()
) => {
  const command = new DeleteRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteRolePolicy = async (
  params: DeleteRolePolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new DeleteRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteUser = async (
  params: DeleteUserCommandInput,
  client = createIAMClient()
) => {
  const command = new DeleteUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteUserPolicy = async (
  params: DeleteUserPolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new DeleteUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const detachRolePolicy = async (
  params: DetachRolePolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new DetachRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const detachUserPolicy = async (
  params: DetachUserPolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new DetachUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const generateCredentialReport = async (
  params: GenerateCredentialReportCommandInput,
  client = createIAMClient()
) => {
  const command = new GenerateCredentialReportCommand(params);
  const result = await client.send(command);
  return result;
};

export const getAccessKeyLastUsed = async (
  params: GetAccessKeyLastUsedCommandInput,
  client = createIAMClient()
) => {
  const command = new GetAccessKeyLastUsedCommand(params);
  const result = await client.send(command);
  return result;
};

export const getAccountAuthorizationDetails = async (
  params: GetAccountAuthorizationDetailsCommandInput,
  client = createIAMClient()
) => {
  const command = new GetAccountAuthorizationDetailsCommand(params);
  const result = await client.send(command);
  return result;
};

export const getAccountSummary = async (
  params: GetAccountSummaryCommandInput,
  client = createIAMClient()
) => {
  const command = new GetAccountSummaryCommand(params);
  const result = await client.send(command);
  return result;
};

export const getCredentialReport = async (
  params: GetCredentialReportCommandInput,
  client = createIAMClient()
) => {
  const command = new GetCredentialReportCommand(params);
  const result = await client.send(command);
  return result;
};

export const getGroup = async (
  params: GetGroupCommandInput,
  client = createIAMClient()
) => {
  const command = new GetGroupCommand(params);
  const result = await client.send(command);
  return result;
};

export const getPolicy = async (
  params: GetPolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new GetPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const getPolicyVersion = async (
  params: GetPolicyVersionCommandInput,
  client = createIAMClient()
) => {
  const command = new GetPolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const getRole = async (
  params: GetRoleCommandInput,
  client = createIAMClient()
) => {
  const command = new GetRoleCommand(params);
  const result = await client.send(command);
  return result;
};

export const getUser = async (
  params: GetUserCommandInput,
  client = createIAMClient()
) => {
  const command = new GetUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAccessKeys = async (
  params: ListAccessKeysCommandInput,
  client = createIAMClient()
) => {
  const command = new ListAccessKeysCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAccountAliases = async (
  params: ListAccountAliasesCommandInput,
  client = createIAMClient()
) => {
  const command = new ListAccountAliasesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAttachedRolePolicies = async (
  params: ListAttachedRolePoliciesCommandInput,
  client = createIAMClient()
) => {
  const command = new ListAttachedRolePoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listAttachedUserPolicies = async (
  params: ListAttachedUserPoliciesCommandInput,
  client = createIAMClient()
) => {
  const command = new ListAttachedUserPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listGroups = async (
  params: ListGroupsCommandInput,
  client = createIAMClient()
) => {
  const command = new ListGroupsCommand(params);
  const result = await client.send(command);
  return result;
};

export const listPolicies = async (
  params: ListPoliciesCommandInput,
  client = createIAMClient()
) => {
  const command = new ListPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listPolicyVersions = async (
  params: ListPolicyVersionsCommandInput,
  client = createIAMClient()
) => {
  const command = new ListPolicyVersionsCommand(params);
  const result = await client.send(command);
  return result;
};

export const listRolePolicies = async (
  params: ListRolePoliciesCommandInput,
  client = createIAMClient()
) => {
  const command = new ListRolePoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listRoles = async (
  params: ListRolesCommandInput,
  client = createIAMClient()
) => {
  const command = new ListRolesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listUserPolicies = async (
  params: ListUserPoliciesCommandInput,
  client = createIAMClient()
) => {
  const command = new ListUserPoliciesCommand(params);
  const result = await client.send(command);
  return result;
};

export const listUsers = async (
  params: ListUsersCommandInput,
  client = createIAMClient()
) => {
  const command = new ListUsersCommand(params);
  const result = await client.send(command);
  return result;
};

export const putRolePolicy = async (
  params: PutRolePolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new PutRolePolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const putUserPolicy = async (
  params: PutUserPolicyCommandInput,
  client = createIAMClient()
) => {
  const command = new PutUserPolicyCommand(params);
  const result = await client.send(command);
  return result;
};

export const setDefaultPolicyVersion = async (
  params: SetDefaultPolicyVersionCommandInput,
  client = createIAMClient()
) => {
  const command = new SetDefaultPolicyVersionCommand(params);
  const result = await client.send(command);
  return result;
};

export const updateAccessKey = async (
  params: UpdateAccessKeyCommandInput,
  client = createIAMClient()
) => {
  const command = new UpdateAccessKeyCommand(params);
  const result = await client.send(command);
  return result;
};

export const updateUser = async (
  params: UpdateUserCommandInput,
  client = createIAMClient()
) => {
  const command = new UpdateUserCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteAllPolicyVersions = async (
  PolicyArn?: string,
  client = createIAMClient()
) => {
  const { Versions } = await listPolicyVersions({ PolicyArn }, client);
  const promises =
    Versions?.filter(({ IsDefaultVersion }) => !IsDefaultVersion).map(
      async ({ VersionId }) => {
        const result = await deletePolicyVersion(
          { PolicyArn, VersionId },
          client
        );
        return result;
      }
      /* c8 ignore next */
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllRolePolicies = async (
  RoleName?: string,
  client = createIAMClient()
) => {
  const { PolicyNames } = await listRolePolicies({ RoleName }, client);
  const promises =
    PolicyNames?.map(async PolicyName => {
      const result = await deleteRolePolicy({ PolicyName, RoleName }, client);
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllUserAccessKeys = async (
  UserName?: string,
  client = createIAMClient()
) => {
  const { AccessKeyMetadata } = await listAccessKeys({ UserName }, client);
  const promises =
    AccessKeyMetadata?.map(async ({ AccessKeyId }) => {
      const result = await deleteAccessKey({ UserName, AccessKeyId }, client);
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllUserPolicies = async (
  UserName?: string,
  client = createIAMClient()
) => {
  const { PolicyNames } = await listUserPolicies({ UserName }, client);
  const promises =
    PolicyNames?.map(async PolicyName => {
      const result = await deleteUserPolicy({ UserName, PolicyName }, client);
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteGroupsByPrefix = async (
  prefix: string,
  client = createIAMClient()
) => {
  const { Groups } = await listGroups({}, client);
  const promises =
    Groups?.filter(({ GroupName }) => GroupName?.startsWith(prefix)).map(
      async ({ GroupName }) => {
        const result = await deleteGroup({ GroupName }, client);
        return result;
      }
      /* c8 ignore next */
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deletePoliciesByPrefix = async (
  prefix: string,
  client = createIAMClient()
) => {
  const { Policies } = await listPolicies({ Scope: "Local" }, client);
  const promises =
    Policies?.filter(({ PolicyName }) => PolicyName?.startsWith(prefix)).map(
      async ({ Arn }) => {
        await deleteAllPolicyVersions(Arn, client);
        const result = await deletePolicy({ PolicyArn: Arn }, client);
        return result;
      }
      /* c8 ignore next */
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteRolesByPrefix = async (
  prefix: string,
  client = createIAMClient()
) => {
  const { Roles } = await listRoles({}, client);
  const promises =
    Roles?.filter(({ RoleName }) => RoleName?.startsWith(prefix)).map(
      async ({ RoleName }) => {
        await detachAllRolePolicies(RoleName, client);
        await deleteAllRolePolicies(RoleName, client);
        const result = await deleteRole({ RoleName }, client);
        return result;
      }
      /* c8 ignore next */
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteUsersByPrefix = async (
  prefix: string,
  client = createIAMClient()
) => {
  const { Users } = await listUsers({}, client);
  const promises =
    Users?.filter(({ UserName }) => UserName?.startsWith(prefix)).map(
      async ({ UserName }) => {
        await detachAllUserPolicies(UserName, client);
        await deleteAllUserPolicies(UserName, client);
        await deleteAllUserAccessKeys(UserName, client);
        const result = await deleteUser({ UserName }, client);
        return result;
      }
      /* c8 ignore next */
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const detachAllRolePolicies = async (
  RoleName?: string,
  client = createIAMClient()
) => {
  const { AttachedPolicies } = await listAttachedRolePolicies(
    { RoleName },
    client
  );
  const promises =
    AttachedPolicies?.map(async ({ PolicyArn }) => {
      const result = await detachRolePolicy({ RoleName, PolicyArn }, client);
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const detachAllUserPolicies = async (
  UserName?: string,
  client = createIAMClient()
) => {
  const { AttachedPolicies } = await listAttachedUserPolicies(
    { UserName },
    client
  );
  const promises =
    AttachedPolicies?.map(async ({ PolicyArn }) => {
      const result = await detachUserPolicy({ UserName, PolicyArn }, client);
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};
