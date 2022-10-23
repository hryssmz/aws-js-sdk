// apigateway/scripts/args.ts
export const restApiName = "my-rest-api";
export const resourceParent = "/";
export const pathPart = "my-endpoint";
export const resourcePath = `${resourceParent.replace(/\/$/, "")}/${pathPart}`;
export const restMethod = "DELETE";
export const restAuth = "NONE";
