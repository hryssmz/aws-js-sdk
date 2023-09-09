// cognito/actions/admin.ts
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { jsonSerialize } from "../../utils";
import { CognitoIdentityWrapper, CognitoIdpWrapper } from "..";
import { STSWrapper } from "../../sts";
import {
  clientId,
  password,
  identityPoolId,
  identityProviderName,
  userAttributes,
  username,
  userPoolId,
} from "./common";
import type { Action } from "../../utils";

async function adminCreateUser() {
  const cognitoIdp = new CognitoIdpWrapper();
  await cognitoIdp.adminCreateUser({
    UserPoolId: userPoolId,
    Username: username,
    TemporaryPassword: `temp-${password}`,
    UserAttributes: userAttributes,
    DesiredDeliveryMediums: ["EMAIL"],
  });
  const { Session, ChallengeName } = await cognitoIdp.adminInitiateAuth({
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: `temp-${password}`,
    },
  });
  const { AuthenticationResult } = await cognitoIdp.adminRespondToAuthChallenge(
    {
      UserPoolId: userPoolId,
      ClientId: clientId,
      ChallengeName,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: password,
      },
      Session,
    }
  );
  return jsonSerialize(AuthenticationResult);
}

async function adminDeleteUser() {
  const cognitoIdp = new CognitoIdpWrapper();
  await cognitoIdp.adminDeleteUser({
    Username: username,
    UserPoolId: userPoolId,
  });
  return jsonSerialize(username);
}

async function adminInitiateAuth() {
  const cognitoIdp = new CognitoIdpWrapper();
  const { ChallengeName, ChallengeParameters, Session, AuthenticationResult } =
    await cognitoIdp.adminInitiateAuth({
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });
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
    return jsonSerialize(AuthenticationResult);
  } else {
    const result = { ChallengeName, ChallengeParameters, Session };
    return jsonSerialize(result);
  }
}

async function cognitoIdGetCredential() {
  const cognitoIdp = new CognitoIdpWrapper();
  const cognitoIdentity = new CognitoIdentityWrapper();
  const { AuthenticationResult } = await cognitoIdp.adminInitiateAuth({
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });
  if (AuthenticationResult === undefined) {
    return jsonSerialize(undefined);
  }

  const { IdentityId } = await cognitoIdentity.getId({
    IdentityPoolId: identityPoolId,
  });
  const { Credentials } = await cognitoIdentity
    .getCredentialsForIdentity({
      IdentityId,
      Logins: {
        [identityProviderName]: AuthenticationResult.IdToken ?? "",
      },
    })
    .catch((error: Error) => {
      console.error(error.name);
      throw error;
    });

  const accessKeyId = Credentials?.AccessKeyId;
  const secretAccessKey = Credentials?.SecretKey;
  const sessionToken = Credentials?.SessionToken;
  const expiration = Credentials?.Expiration;
  if (accessKeyId === undefined || secretAccessKey === undefined) {
    return jsonSerialize(undefined);
  }
  const sts = new STSWrapper({
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken,
      expiration,
    },
  });
  const { Arn, UserId } = await sts.getCallerIdentity({});
  console.log(jsonSerialize({ Arn, UserId }));

  return jsonSerialize(Credentials);
}

async function cognitoListUsers() {
  const cognitoIdp = new CognitoIdpWrapper();
  const { Users } = await cognitoIdp.listUsers({
    UserPoolId: userPoolId,
  });
  const users = Users?.map(({ Username, UserStatus }) => ({
    Username,
    UserStatus,
  }));
  return jsonSerialize(users);
}

const actions: Record<string, Action> = {
  adminCreateUser,
  adminDeleteUser,
  adminInitiateAuth,
  cognitoIdGetCredential,
  cognitoListUsers,
};

export default actions;
