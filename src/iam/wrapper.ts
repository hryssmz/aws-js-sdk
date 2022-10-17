// iam/actions/wrapper.ts
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
import { defaultClientConfig } from "../utils";
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

export const defaultIAMClientConfig = {
  ...defaultClientConfig,
};

export class IAMWrapper {
  client: IAMClient;

  constructor(config?: IAMClientConfig) {
    this.client = new IAMClient({ ...defaultIAMClientConfig, ...config });
  }

  async attachRolePolicy(params: AttachRolePolicyCommandInput) {
    const command = new AttachRolePolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async attachUserPolicy(params: AttachUserPolicyCommandInput) {
    const command = new AttachUserPolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createAccessKey(params: CreateAccessKeyCommandInput) {
    const command = new CreateAccessKeyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createAccountAlias(params: CreateAccountAliasCommandInput) {
    const command = new CreateAccountAliasCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createGroup(params: CreateGroupCommandInput & { Path: string }) {
    const command = new CreateGroupCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createPolicy(params: CreatePolicyCommandInput & { Path: string }) {
    const command = new CreatePolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createPolicyVersion(params: CreatePolicyVersionCommandInput) {
    const command = new CreatePolicyVersionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createRole(params: CreateRoleCommandInput & { Path: string }) {
    const command = new CreateRoleCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async createUser(params: CreateUserCommandInput & { Path: string }) {
    const command = new CreateUserCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteAccessKey(params: DeleteAccessKeyCommandInput) {
    const command = new DeleteAccessKeyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteAccountAlias(params: DeleteAccountAliasCommandInput) {
    const command = new DeleteAccountAliasCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteGroup(params: DeleteGroupCommandInput) {
    const command = new DeleteGroupCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deletePolicy(params: DeletePolicyCommandInput) {
    const command = new DeletePolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deletePolicyVersion(params: DeletePolicyVersionCommandInput) {
    const command = new DeletePolicyVersionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteRole(params: DeleteRoleCommandInput) {
    const command = new DeleteRoleCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteRolePolicy(params: DeleteRolePolicyCommandInput) {
    const command = new DeleteRolePolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteUser(params: DeleteUserCommandInput) {
    const command = new DeleteUserCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteUserPolicy(params: DeleteUserPolicyCommandInput) {
    const command = new DeleteUserPolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async detachRolePolicy(params: DetachRolePolicyCommandInput) {
    const command = new DetachRolePolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async detachUserPolicy(params: DetachUserPolicyCommandInput) {
    const command = new DetachUserPolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async generateCredentialReport(params: GenerateCredentialReportCommandInput) {
    const command = new GenerateCredentialReportCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getGroup(params: GetGroupCommandInput) {
    const command = new GetGroupCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getAccessKeyLastUsed(params: GetAccessKeyLastUsedCommandInput) {
    const command = new GetAccessKeyLastUsedCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getAccountAuthorizationDetails(
    params: GetAccountAuthorizationDetailsCommandInput
  ) {
    const command = new GetAccountAuthorizationDetailsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getAccountSummary(params: GetAccountSummaryCommandInput) {
    const command = new GetAccountSummaryCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getCredentialReport(params: GetCredentialReportCommandInput) {
    const command = new GetCredentialReportCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getPolicy(params: GetPolicyCommandInput) {
    const command = new GetPolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getPolicyVersion(params: GetPolicyVersionCommandInput) {
    const command = new GetPolicyVersionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getRole(params: GetRoleCommandInput) {
    const command = new GetRoleCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getUser(params: GetUserCommandInput) {
    const command = new GetUserCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listAccessKeys(params: ListAccessKeysCommandInput) {
    const command = new ListAccessKeysCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listAccountAliases(params: ListAccountAliasesCommandInput) {
    const command = new ListAccountAliasesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listAttachedRolePolicies(params: ListAttachedRolePoliciesCommandInput) {
    const command = new ListAttachedRolePoliciesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listAttachedUserPolicies(params: ListAttachedUserPoliciesCommandInput) {
    const command = new ListAttachedUserPoliciesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listGroups(params: ListGroupsCommandInput) {
    const command = new ListGroupsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listPolicies(params: ListPoliciesCommandInput) {
    const command = new ListPoliciesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listPolicyVersions(params: ListPolicyVersionsCommandInput) {
    const command = new ListPolicyVersionsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listRolePolicies(params: ListRolePoliciesCommandInput) {
    const command = new ListRolePoliciesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listRoles(params: ListRolesCommandInput) {
    const command = new ListRolesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listUserPolicies(params: ListUserPoliciesCommandInput) {
    const command = new ListUserPoliciesCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listUsers(params: ListUsersCommandInput) {
    const command = new ListUsersCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putRolePolicy(params: PutRolePolicyCommandInput) {
    const command = new PutRolePolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putUserPolicy(params: PutUserPolicyCommandInput) {
    const command = new PutUserPolicyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async setDefaultPolicyVersion(params: SetDefaultPolicyVersionCommandInput) {
    const command = new SetDefaultPolicyVersionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async updateAccessKey(params: UpdateAccessKeyCommandInput) {
    const command = new UpdateAccessKeyCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async updateUser(params: UpdateUserCommandInput) {
    const command = new UpdateUserCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
