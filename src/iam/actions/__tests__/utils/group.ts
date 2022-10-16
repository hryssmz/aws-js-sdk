// iam/actions/__tests__/utils/group.ts
import { deleteGroup, listGroups } from "../../group";

export const deleteGroupsByPath = async (path: string) => {
  const { Groups: groups } = await listGroups({ PathPrefix: path });
  const promises =
    groups?.map(group => deleteGroup({ GroupName: group.GroupName })) ?? [];
  const results = await Promise.all(promises);
  return results;
};
