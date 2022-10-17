// iam/actions/__tests__/utils.ts
import { IAMWrapper } from "..";

export { accountAlias, isLocal, sleep } from "../../utils";
export { deleteDummyBuckets } from "../../s3/__tests__/utils";

export const deleteAllPolicyVersions = async (
  policyArn?: string,
  iam = new IAMWrapper()
) => {
  const { Versions: versions } = await iam.listPolicyVersions({
    PolicyArn: policyArn,
  });
  const promises =
    versions
      ?.filter(version => !version.IsDefaultVersion)
      .map(async version => {
        const result = await iam.deletePolicyVersion({
          PolicyArn: policyArn,
          VersionId: version.VersionId,
        });
        return result;
      }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllRolePolicies = async (
  roleName?: string,
  iam = new IAMWrapper()
) => {
  const { PolicyNames: policyNames } = await iam.listRolePolicies({
    RoleName: roleName,
  });
  const promises =
    policyNames?.map(async policyName => {
      const result = await iam.deleteRolePolicy({
        PolicyName: policyName,
        RoleName: roleName,
      });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllUserAccessKeys = async (
  userName?: string,
  iam = new IAMWrapper()
) => {
  const { AccessKeyMetadata: accessKeys } = await iam.listAccessKeys({
    UserName: userName,
  });
  const promises =
    accessKeys?.map(async accessKey => {
      const result = await iam.deleteAccessKey({
        UserName: userName,
        AccessKeyId: accessKey.AccessKeyId,
      });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteAllUserPolicies = async (
  userName?: string,
  iam = new IAMWrapper()
) => {
  const { PolicyNames: policyNames } = await iam.listUserPolicies({
    UserName: userName,
  });
  const promises =
    policyNames?.map(async policyName => {
      const result = await iam.deleteUserPolicy({
        UserName: userName,
        PolicyName: policyName,
      });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const detachAllRolePolicies = async (
  roleName?: string,
  iam = new IAMWrapper()
) => {
  const { AttachedPolicies: policies } = await iam.listAttachedRolePolicies({
    RoleName: roleName,
  });
  const promises =
    policies?.map(async policy => {
      const result = await iam.detachRolePolicy({
        RoleName: roleName,
        PolicyArn: policy.PolicyArn,
      });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const detachAllUserPolicies = async (
  userName?: string,
  iam = new IAMWrapper()
) => {
  const { AttachedPolicies: policies } = await iam.listAttachedUserPolicies({
    UserName: userName,
  });
  const promises =
    policies?.map(async policy => {
      const result = await iam.detachUserPolicy({
        UserName: userName,
        PolicyArn: policy.PolicyArn,
      });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteGroupsByPath = async (
  path: string,
  iam = new IAMWrapper()
) => {
  const { Groups: groups } = await iam.listGroups({ PathPrefix: path });
  const promises =
    groups?.map(async group => {
      const result = await iam.deleteGroup({ GroupName: group.GroupName });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deletePoliciesByPath = async (
  path: string,
  iam = new IAMWrapper()
) => {
  const { Policies: policies } = await iam.listPolicies({ PathPrefix: path });
  const promises =
    policies?.map(async policy => {
      await deleteAllPolicyVersions(policy.Arn, iam);
      const result = await iam.deletePolicy({ PolicyArn: policy.Arn });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteRolesByPath = async (
  path: string,
  iam = new IAMWrapper()
) => {
  const { Roles: roles } = await iam.listRoles({ PathPrefix: path });
  const promises =
    roles?.map(async role => {
      await detachAllRolePolicies(role.RoleName, iam);
      await deleteAllRolePolicies(role.RoleName, iam);
      const result = await iam.deleteRole({ RoleName: role.RoleName });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};

export const deleteUsersByPath = async (
  path: string,
  iam = new IAMWrapper()
) => {
  const { Users: users } = await iam.listUsers({ PathPrefix: path });
  const promises =
    users?.map(async user => {
      await detachAllUserPolicies(user.UserName, iam);
      await deleteAllUserPolicies(user.UserName, iam);
      await deleteAllUserAccessKeys(user.UserName, iam);
      const result = await iam.deleteUser({ UserName: user.UserName });
      return result;
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
};
