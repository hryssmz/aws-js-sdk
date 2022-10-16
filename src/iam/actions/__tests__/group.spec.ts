// iam/actions/__tests__/group.spec.ts
import { createGroup, getGroup } from "../group";
import { groupName, path } from "./dummy";
import { deleteGroupsByPath } from "./utils";

beforeEach(async () => {
  await deleteGroupsByPath(path);
});

afterAll(async () => {
  await deleteGroupsByPath(path);
});

test("Create group", async () => {
  const { Group: group1 } = await createGroup({
    GroupName: groupName,
    Path: path,
  });

  expect(group1?.GroupName).toBe(groupName);

  const { Group: group2 } = await getGroup({ GroupName: groupName });

  expect(group2?.GroupId).toBe(group2?.GroupId);
});
