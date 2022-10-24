// iam/__tests__/dummy.ts
export { roleSessionName } from "../../sts/__tests__/dummy";
export { bucket, objectBody, objectKey } from "../../s3/__tests__/dummy";

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
