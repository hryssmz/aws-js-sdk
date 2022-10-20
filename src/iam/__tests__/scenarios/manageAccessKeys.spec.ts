// iam/__tests__/scenarios/manageAccessKeys.spec.ts
import { IAMWrapper } from "../..";
import { isLocal } from "../utils";
import { userName } from "../dummy";

jest.setTimeout((isLocal ? 5 : 15) * 1000);

const iam = new IAMWrapper();

beforeAll(async () => {
  await iam.deleteUsersByPrefix(userName);
});

afterAll(async () => {
  await iam.deleteUsersByPrefix(userName);
});

test("Manage IAM access keys", async () => {
  // Create a new user.
  await iam.createUser({ UserName: userName });

  // Create an access key for the user.
  const { AccessKey } = await iam.createAccessKey({ UserName: userName });

  // List access keys.
  const { AccessKeyMetadata } = await iam.listAccessKeys({
    UserName: userName,
  });

  expect(AccessKeyMetadata?.[0].AccessKeyId).toBe(AccessKey?.AccessKeyId);

  // Get access key last used info.
  const { AccessKeyLastUsed } = await iam.getAccessKeyLastUsed({
    AccessKeyId: AccessKey?.AccessKeyId,
  });

  expect(AccessKeyLastUsed?.LastUsedDate).toBeUndefined();
  expect(AccessKeyLastUsed?.Region).toBe("N/A");
  expect(AccessKeyLastUsed?.ServiceName).toBe("N/A");

  // Make access key inactive.
  const getFirstAccessKeyStatus = async () => {
    const { AccessKeyMetadata } = await iam.listAccessKeys({
      UserName: userName,
    });
    const status = AccessKeyMetadata?.[0].Status;
    return status;
  };

  expect(await getFirstAccessKeyStatus()).toBe("Active");

  await iam.updateAccessKey({
    UserName: userName,
    AccessKeyId: AccessKey?.AccessKeyId,
    Status: "Inactive",
  });

  expect(await getFirstAccessKeyStatus()).toBe("Inactive");

  // Delete access key.
  await iam.deleteAccessKey({
    UserName: userName,
    AccessKeyId: AccessKey?.AccessKeyId,
  });

  // Delete the user.
  await iam.deleteUser({ UserName: userName });
});
