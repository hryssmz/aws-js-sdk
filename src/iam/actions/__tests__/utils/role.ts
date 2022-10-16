// iam/actions/__tests__/utils/role.ts
import { deleteRole, listRoles } from "../../role";
import { detachAllRolePolicies } from "./rolePolicy";

export const deleteRolesByPath = async (path?: string) => {
  const { Roles: roles } = await listRoles({ PathPrefix: path });
  const promises =
    roles?.map(role =>
      detachAllRolePolicies(role.RoleName).then(() =>
        deleteRole({ RoleName: role.RoleName })
      )
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};
