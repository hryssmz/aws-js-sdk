// cognito/actions/common.ts
import { region } from "../../config";
import type { AttributeType } from "@aws-sdk/client-cognito-identity-provider";

export const userPoolId = "ap-northeast-1_L4Q3ASCma";
export const clientId = "10b6kmgrlpe4p8qaebebnaqk9";
export const identityPoolId =
  "ap-northeast-1:2b879df7-f46a-44ca-83ff-1bbb40b74a92";
export const username = "hryssmz";
export const password = "P@ssw0rd";
export const userAttributes: AttributeType[] = [
  { Name: "email", Value: "hryssmz@yahoo.com" },
  { Name: "email_verified", Value: "true" },
  // { Name: "given_name", Value: "Hiroyasu" },
  // { Name: "family_name", Value: "Shimizu" },
];
export const confirmationCode = "534724";
export const cognitoIdpUrl = `https://cognito-idp.${region}.amazonaws.com`;
export const cognitoIdentityUrl = `https://cognito-identity.${region}.amazonaws.com`;
export const identityProviderName = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;
