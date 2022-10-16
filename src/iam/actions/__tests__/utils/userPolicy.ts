// iam/actions/__tests__/utils/userPolicy.ts
import { detachUserPolicy, listAttachedUserPolicies } from "../../userPolicy";

export const detachAllUserPolicies = async (userName?: string) => {
  const { AttachedPolicies: policies } = await listAttachedUserPolicies({
    UserName: userName,
  });
  const promises =
    policies?.map(policy =>
      detachUserPolicy({ UserName: userName, PolicyArn: policy.PolicyArn })
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};
