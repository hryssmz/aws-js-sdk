// iam/actions/__tests__/utils/rolePolicy.ts
import { detachRolePolicy, listAttachedRolePolicies } from "../../rolePolicy";

export const detachAllRolePolicies = async (roleName?: string) => {
  const { AttachedPolicies: policies } = await listAttachedRolePolicies({
    RoleName: roleName,
  });
  const promises =
    policies?.map(policy =>
      detachRolePolicy({ RoleName: roleName, PolicyArn: policy.PolicyArn })
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};
