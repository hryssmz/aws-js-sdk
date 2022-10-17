// iam/__tests__/scenarios/manageAccessKeys.spec.ts
import { IAMWrapper } from "../..";
import { deleteUsersByPath, isLocal } from "../utils";
import { path, userName } from "../dummy";

jest.setTimeout((isLocal ? 5 : 60) * 1000);

beforeAll(async () => {
  await deleteUsersByPath(path);
});

afterAll(async () => {
  await deleteUsersByPath(path);
});

test("Manage IAM access keys", async () => {
  const iam = new IAMWrapper();

  // Create a new user.
  await iam.createUser({
    UserName: userName,
    Path: path,
  });

  // Create an access key for the user.
  const { AccessKey: accessKey } = await iam.createAccessKey({
    UserName: userName,
  });

  // List access keys.
  const { AccessKeyMetadata: accessKeys } = await iam.listAccessKeys({
    UserName: userName,
  });

  expect(accessKeys?.[0].AccessKeyId).toBe(accessKey?.AccessKeyId);

  // Get access key last used info.
  const { AccessKeyLastUsed: lastUsed } = await iam.getAccessKeyLastUsed({
    AccessKeyId: accessKey?.AccessKeyId,
  });

  expect(lastUsed?.LastUsedDate).toBeUndefined();
  expect(lastUsed?.Region).toBe("N/A");
  expect(lastUsed?.ServiceName).toBe("N/A");

  // Make access key inactive.
  const getFirstAccessKeyStatus = async () => {
    const { AccessKeyMetadata: accessKeys } = await iam.listAccessKeys({
      UserName: userName,
    });
    const status = accessKeys?.[0].Status;
    return status;
  };

  expect(await getFirstAccessKeyStatus()).toBe("Active");

  await iam.updateAccessKey({
    UserName: userName,
    AccessKeyId: accessKey?.AccessKeyId,
    Status: "Inactive",
  });

  expect(await getFirstAccessKeyStatus()).toBe("Inactive");

  // Delete access key.
  await iam.deleteAccessKey({
    UserName: userName,
    AccessKeyId: accessKey?.AccessKeyId,
  });

  // Delete the user.
  await iam.deleteUser({ UserName: userName });
});
