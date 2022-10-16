// utils/clients.ts
import { IAMClient } from "@aws-sdk/client-iam";
import { S3Client } from "@aws-sdk/client-s3";
import { STSClient } from "@aws-sdk/client-sts";
import type { IAMClientConfig } from "@aws-sdk/client-iam";
import type { S3ClientConfig } from "@aws-sdk/client-s3";
import type { STSClientConfig } from "@aws-sdk/client-sts";
import { defaultClientConfig } from "./config";

export const iamClient = (config?: IAMClientConfig) => {
  return new IAMClient({ ...defaultClientConfig, ...config });
};

export const s3Client = (config?: S3ClientConfig) => {
  return new S3Client({ ...defaultClientConfig, ...config });
};

export const stsClient = (config?: STSClientConfig) => {
  return new STSClient({ ...defaultClientConfig, ...config });
};
