// iam/actions/__tests__/user.spec.ts
import {
  createAccessKey,
  createUser,
  deleteAccessKey,
  getUser,
  listAccessKeys,
  updateUser,
} from "../user";
import { path, userName } from "./dummy";
import { deleteUsersByPath } from "./utils";

beforeEach(async () => {
  await deleteUsersByPath(path);
});

afterAll(async () => {
  await deleteUsersByPath(path);
});

test("Create user", async () => {
  const { User: user1 } = await createUser({
    UserName: userName,
    Path: path,
  });

  expect(user1?.UserName).toBe(userName);

  const { User: user2 } = await getUser({ UserName: userName });

  expect(user2?.UserId).toBe(user1?.UserId);
});

test("Update user", async () => {
  const oldUserName = "john_doe";
  await createUser({ UserName: oldUserName, Path: path });
  const { User: user1 } = await getUser({ UserName: oldUserName });

  expect(user1?.UserName).toBe(oldUserName);

  await updateUser({ UserName: oldUserName, NewUserName: userName });
  const { User: user2 } = await getUser({ UserName: userName });

  expect(user2?.UserName).toBe(userName);
  expect(user2?.UserId).toBe(user1?.UserId);
});

test("Create and remove access key", async () => {
  await createUser({ UserName: userName, Path: path });
  const { AccessKeyMetadata: accessKeys1 } = await listAccessKeys({
    UserName: userName,
  });

  expect(accessKeys1).toHaveLength(0);

  await createAccessKey({ UserName: userName });
  const { AccessKeyMetadata: accessKeys2 } = await listAccessKeys({
    UserName: userName,
  });

  expect(accessKeys2).toHaveLength(1);

  await deleteAccessKey({
    UserName: userName,
    AccessKeyId: accessKeys2?.[0].AccessKeyId,
  });
  const { AccessKeyMetadata: accessKeys3 } = await listAccessKeys({
    UserName: userName,
  });

  expect(accessKeys3).toHaveLength(0);
});
