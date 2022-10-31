// iam/actions.ts
import { IAMWrapper } from ".";
import type { Action } from "../utils";

async function deleteUser(userName?: string) {
  if (userName === undefined) {
    throw new Error("Must provide user name!");
  }
  const iam = new IAMWrapper();
  await iam.detachAllUserPolicies(userName);
  await iam.deleteAllUserPolicies(userName);
  await iam.deleteUser({ UserName: userName });
  return JSON.stringify(userName, null, 2);
}

const actions: Record<string, Action> = {
  deleteUser,
};

export default actions;
