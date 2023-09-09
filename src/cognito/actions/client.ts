// cognito/actions/client.ts
import axios from "axios";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { jsonSerialize } from "../../utils";
import {
  clientId,
  cognitoIdentityUrl,
  cognitoIdpUrl,
  confirmationCode,
  identityPoolId,
  identityProviderName,
  password,
  userAttributes,
  username,
  userPoolId,
} from "./common";
import type {
  GetIdCommandInput,
  GetIdCommandOutput,
  GetCredentialsForIdentityCommandInput,
  GetCredentialsForIdentityCommandOutput,
} from "@aws-sdk/client-cognito-identity";
import type {
  DeleteUserCommandInput,
  DeleteUserCommandOutput,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommandOutput,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  SignUpCommandInput,
  SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import type { Action } from "../../utils";

async function cognitoConfirmSignUp() {
  const confirmSignUpInput: ConfirmSignUpCommandInput = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: confirmationCode,
  };
  await axios.post<ConfirmSignUpCommandOutput>(
    cognitoIdpUrl,
    confirmSignUpInput,
    {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
      },
    }
  );
  return jsonSerialize(username);
}

async function cognitoDeleteUser() {
  const initiateAuthInput: InitiateAuthCommandInput = {
    ClientId: clientId,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  const {
    data: { AuthenticationResult },
  } = await axios.post<InitiateAuthCommandOutput>(
    cognitoIdpUrl,
    initiateAuthInput,
    {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
    }
  );
  const deleteUserInput: DeleteUserCommandInput = {
    AccessToken: AuthenticationResult?.AccessToken,
  };
  await axios.post<DeleteUserCommandOutput>(cognitoIdpUrl, deleteUserInput, {
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.DeleteUser",
    },
  });
  return jsonSerialize(username);
}

async function cognitoSignUp() {
  const signUpInput: SignUpCommandInput = {
    ClientId: clientId,
    Username: username,
    Password: password,
    UserAttributes: userAttributes,
  };
  await axios.post<SignUpCommandOutput>(cognitoIdpUrl, signUpInput, {
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
    },
  });
  return jsonSerialize(username);
}

async function cognitoGetCredential() {
  const initiateAuthInput: InitiateAuthCommandInput = {
    ClientId: clientId,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  const {
    data: { AuthenticationResult },
  } = await axios.post<InitiateAuthCommandOutput>(
    cognitoIdpUrl,
    initiateAuthInput,
    {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
    }
  );
  if (AuthenticationResult === undefined) {
    return jsonSerialize(undefined);
  }

  const getIdInput: GetIdCommandInput = {
    IdentityPoolId: identityPoolId,
  };
  const {
    data: { IdentityId },
  } = await axios.post<GetIdCommandOutput>(cognitoIdentityUrl, getIdInput, {
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityService.GetId",
    },
  });

  const getCredentialsForIdentityInput: GetCredentialsForIdentityCommandInput =
    {
      IdentityId,
      Logins: {
        [identityProviderName]: AuthenticationResult.IdToken ?? "",
      },
    };
  const {
    data: { Credentials },
  } = await axios.post<GetCredentialsForIdentityCommandOutput>(
    cognitoIdentityUrl,
    getCredentialsForIdentityInput,
    {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityService.GetCredentialsForIdentity",
      },
    }
  );
  return jsonSerialize(Credentials);
}

async function initiateAuth() {
  const initiateAuthInput: InitiateAuthCommandInput = {
    ClientId: clientId,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  const {
    data: { ChallengeName, ChallengeParameters, Session, AuthenticationResult },
  } = await axios.post<InitiateAuthCommandOutput>(
    cognitoIdpUrl,
    initiateAuthInput,
    {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
    }
  );
  if (AuthenticationResult !== undefined) {
    const { AccessToken, IdToken } = AuthenticationResult;
    if (IdToken !== undefined) {
      const verifier = CognitoJwtVerifier.create({
        userPoolId,
        tokenUse: "id",
        clientId,
      });
      const payload = await verifier.verify(IdToken);
      console.log(jsonSerialize(payload));
    }
    if (AccessToken !== undefined) {
      const verifier = CognitoJwtVerifier.create({
        userPoolId,
        tokenUse: "access",
        clientId,
      });
      const payload = await verifier.verify(AccessToken);
      console.log(jsonSerialize(payload));
    }
    return jsonSerialize(username);
  } else {
    const result = { ChallengeName, ChallengeParameters, Session };
    return jsonSerialize(result);
  }
}

const actions: Record<string, Action> = {
  cognitoConfirmSignUp,
  cognitoDeleteUser,
  cognitoGetCredential,
  cognitoSignUp,
  initiateAuth,
};

export default actions;
