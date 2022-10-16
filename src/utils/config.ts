// utils/config.ts
export const isLocal = true;

export const accountId = isLocal ? "000000000000" : "512667299293";

export const defaultClientConfig = {
  region: "ap-northeast-1",
  endpoint: isLocal ? "http://localstack:4566" : undefined,
};
