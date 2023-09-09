// utils/config.ts
import { fromSSO } from "@aws-sdk/credential-providers";

export const accountAlias = "hryssmz";
export const profile = "default";
export const region = "ap-northeast-1";

export const defaultClientConfig = {
  region,
  endpoint: undefined,
  credentials: fromSSO({ profile }),
};
