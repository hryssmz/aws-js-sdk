// sts/__tests__/legacy.spec.ts
import { assumeRole, createSTSClient } from "../legacy";
import { policyName, roleName, roleSessionName, userName } from "./dummy";
import { isLocal, sleep } from "./utils";
import {
  attachUserPolicy,
  createAccessKey,
  createPolicy,
  createRole,
  createUser,
  deletePoliciesByPrefix,
  deleteRolesByPrefix,
  deleteUsersByPrefix,
} from "../../iam";

jest.setTimeout((isLocal ? 5 : 60) * 1000);

beforeEach(async () => {
  await deleteUsersByPrefix(userName);
  await deleteRolesByPrefix(roleName);
  await deletePoliciesByPrefix(policyName);
});

afterAll(async () => {
  await deleteUsersByPrefix(userName);
  await deleteRolesByPrefix(roleName);
  await deletePoliciesByPrefix(policyName);
});

test("User has permissions to assume a role", async () => {
  // Create a new user.
  const { User } = await createUser({ UserName: userName });

  // Create access keys for the new user.
  const { AccessKey } = await createAccessKey({ UserName: userName });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const accessKeyId = AccessKey!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const secretAccessKey = AccessKey!.SecretAccessKey!;

  // Need to wait until the user and the access key are active.
  await sleep(isLocal ? 0 : 10);

  // Create a role with a trust policy that lets the user assume the role.
  const { Role } = await createRole({
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: User?.Arn },
          Action: "sts:AssumeRole",
        },
      ],
    }),
  });

  // Create a policy that enables the user to assume the role.
  const { Policy } = await createPolicy({
    PolicyName: policyName,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        { Effect: "Allow", Action: "sts:AssumeRole", Resource: Role?.Arn },
      ],
    }),
  });

  // Attach the policy to the user.
  await attachUserPolicy({ PolicyArn: Policy?.Arn, UserName: userName });

  // Need to wait until the policy has been attached to the user.
  await sleep(isLocal ? 0 : 15);

  const userStsClient = createSTSClient({
    credentials: { accessKeyId, secretAccessKey },
  });
  const { Credentials } = await assumeRole(
    { RoleArn: Role?.Arn, RoleSessionName: roleSessionName },
    userStsClient
  );
  const {
    AccessKeyId: newAccessKeyId,
    SecretAccessKey: newSecretAccessKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = Credentials!;

  expect(newAccessKeyId).toHaveLength(20);
  expect(newSecretAccessKey).toHaveLength(40);
});
