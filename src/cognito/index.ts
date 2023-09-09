// cognito/index.ts
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  DeleteUserCommand,
  InitiateAuthCommand,
  ListUsersCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { defaultClientConfig } from "../utils";
import type {
  CognitoIdentityClientConfig,
  GetCredentialsForIdentityCommandInput,
  GetIdCommandInput,
} from "@aws-sdk/client-cognito-identity";
import type {
  AdminCreateUserCommandInput,
  AdminDeleteUserCommandInput,
  AdminInitiateAuthCommandInput,
  AdminRespondToAuthChallengeCommandInput,
  CognitoIdentityProviderClientConfig,
  ConfirmSignUpCommandInput,
  DeleteUserCommandInput,
  InitiateAuthCommandInput,
  ListUsersCommandInput,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

export const defaultCognitoIdentityClientConfig = {
  ...defaultClientConfig,
};

export const defaultCognitoIdpClientConfig = {
  ...defaultClientConfig,
};

export class CognitoIdentityWrapper {
  client: CognitoIdentityClient;

  constructor(config?: CognitoIdentityClientConfig) {
    this.client = new CognitoIdentityClient({
      ...defaultCognitoIdentityClientConfig,
      ...config,
    });
  }

  async getId(params: GetIdCommandInput) {
    const command = new GetIdCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getCredentialsForIdentity(
    params: GetCredentialsForIdentityCommandInput
  ) {
    const command = new GetCredentialsForIdentityCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}

export class CognitoIdpWrapper {
  client: CognitoIdentityProviderClient;

  constructor(config?: CognitoIdentityProviderClientConfig) {
    this.client = new CognitoIdentityProviderClient({
      ...defaultCognitoIdpClientConfig,
      ...config,
    });
  }

  async adminCreateUser(params: AdminCreateUserCommandInput) {
    const command = new AdminCreateUserCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async adminDeleteUser(params: AdminDeleteUserCommandInput) {
    const command = new AdminDeleteUserCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async adminInitiateAuth(params: AdminInitiateAuthCommandInput) {
    const command = new AdminInitiateAuthCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async adminRespondToAuthChallenge(
    params: AdminRespondToAuthChallengeCommandInput
  ) {
    const command = new AdminRespondToAuthChallengeCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async confirmSignUp(params: ConfirmSignUpCommandInput) {
    const command = new ConfirmSignUpCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteUser(params: DeleteUserCommandInput) {
    const command = new DeleteUserCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async initiateAuth(params: InitiateAuthCommandInput) {
    const command = new InitiateAuthCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listUsers(params: ListUsersCommandInput) {
    const command = new ListUsersCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async signUp(params: SignUpCommandInput) {
    const command = new SignUpCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
