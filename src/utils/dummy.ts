// utils/dummy.ts
import { accountAlias } from "../config";

// API Gateway
export const restApiName = "dummy-rest-api";
export const pathPart = "dummy-endpoint";
export const httpMethod = "GET";

// API Gateway V2
export const apiName = "dummy-api";
export const routeKey = "GET /dummy-endpoint";

// EC2
export const keyPairName = "dummy-key-pair";
export const keyPairPath = `${__dirname}/${keyPairName}.pem`;
export const sgName = "dummy-security-group";
export const sgDesc = "Dummy Security Group";
export const ipPermissions = [
  {
    FromPort: 22,
    ToPort: 22,
    IpProtocol: "tcp",
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
];

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
