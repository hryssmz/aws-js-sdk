// appsync/actions.ts
import { AppSyncWrapper } from ".";
import type { Action } from "../utils";

const apiName = "type-resolution";
const typeName = "Query";
const fieldName = "search";
const format = "JSON";

async function getGraphqlResolver() {
  const appsync = new AppSyncWrapper();
  const apiId = await appsync.getGraphqlApiId(apiName);
  const { resolver } = await appsync.getResolver({
    apiId,
    typeName,
    fieldName,
  });
  return JSON.stringify(resolver, null, 2);
}

async function getGraphqlType() {
  const appsync = new AppSyncWrapper();
  const apiId = await appsync.getGraphqlApiId(apiName);
  const { type } = await appsync.getType({ apiId, typeName, format });
  const definition = JSON.parse(type?.definition ?? "{}");
  return JSON.stringify(definition, null, 2);
}

const actions: Record<string, Action> = {
  getGraphqlResolver,
  getGraphqlType,
};

export default actions;
