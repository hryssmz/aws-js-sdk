// utils/config.ts
export const isLocal = true;

export const accountAlias = "hryssmz";

export const localStackHost = "http://localstack:4566";

export const region = "ap-northeast-1";

export const defaultClientConfig = {
  region,
  endpoint: isLocal ? localStackHost : undefined,
  credentials: isLocal
    ? { accessKeyId: "dummy", secretAccessKey: "dummy" }
    : undefined,
};
