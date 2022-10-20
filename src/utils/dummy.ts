// utils/dummy.ts
import { accountAlias } from "../utils";

// IAM
export const groupName = "DummyGroup";
export const policyArn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess";
export const policyName = "DummyPolicy";
export const roleName = "dummy-role";
export const userName = "DummyUser";

export const trustPolicyJson = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { Service: "lambda.amazonaws.com" },
      Action: "sts:AssumeRole",
    },
  ],
};

export const managedPolicyJson = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Action: "s3:GetObject",
      Resource: "*",
    },
  ],
};

// Lambda
export const funcName = "dummy-function";
export const funcDir = `${__dirname}/dummy-func`;

// S3
export const bucket = `dummy-bucket-${accountAlias}`;
export const objectKey = "dummy-object.txt";
export const objectBody = "Dummy Body";

// STS
export const roleSessionName = "DummyRoleSession";
