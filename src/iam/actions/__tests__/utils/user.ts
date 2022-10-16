// iam/actions/__tests__/utils/user.ts
import {
  deleteAccessKey,
  deleteUser,
  listAccessKeys,
  listUsers,
} from "../../user";
import { detachAllUserPolicies } from "./userPolicy";

export const deleteAllUserAccessKeys = async (userName?: string) => {
  const { AccessKeyMetadata: accessKeys } = await listAccessKeys({
    UserName: userName,
  });
  const promises =
    accessKeys?.map(async accessKey => {
      await deleteAccessKey({
        UserName: userName,
        AccessKeyId: accessKey.AccessKeyId,
      });
    }) || [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteUsersByPath = async (path?: string) => {
  const { Users: users } = await listUsers({ PathPrefix: path });
  const promises =
    users?.map(async user => {
      await detachAllUserPolicies(user.UserName);
      await deleteAllUserAccessKeys(user.UserName);
      await deleteUser({ UserName: user.UserName });
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};
