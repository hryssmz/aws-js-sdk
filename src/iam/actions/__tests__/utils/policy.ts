// iam/actions/__tests__/utils/policy.ts
import { deletePolicy, listPolicies } from "../../policy";

export const deletePoliciesByPath = async (path?: string) => {
  const { Policies: policies } = await listPolicies({ PathPrefix: path });
  const promises =
    policies?.map(policy => deletePolicy({ PolicyArn: policy.Arn })) ?? [];
  const results = await Promise.all(promises);
  return results;
};
