// iam/actions/__tests__/dummy.ts
export const path = "/dummy/";
export const groupName = "DummyGroup";
export const policyArn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess";
export const policyName = "DummyPolicy";
export const roleName = "DummyRole";
export const rolePolicyName = "DummyRolePolicy";
export const userName = "DummyUser";
export const userPolicyName = "DummyUserPolicy";

export const assumeRolePolicyJson = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { Service: "lambda.amazonaws.com" },
      Action: "sts:AssumeRole",
    },
  ],
};

export const identityBasedPolicyJson = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Action: "s3:GetObject",
      Resource: "*",
    },
  ],
};
