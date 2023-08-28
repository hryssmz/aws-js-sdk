// utils/config.ts
import { fromSSO } from "@aws-sdk/credential-providers";

export const isLocal = false;

export const accountAlias = "hryssmz";

export const localStackHost = "http://localstack:4566";

export const profile = "default";

export const region = "ap-northeast-1";

export const defaultClientConfig = {
  region,
  endpoint: isLocal ? localStackHost : undefined,
  credentials: isLocal
    ? { accessKeyId: "dummy", secretAccessKey: "dummy" }
    : fromSSO({ profile }),
};
