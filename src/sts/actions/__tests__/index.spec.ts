// sts/actions/__tests__/index.spec.ts
import { assumeRole } from "..";
import { path, policyName, roleName, roleSessionName, userName } from "./dummy";
import {
  deletePoliciesByPath,
  deleteRolesByPath,
  deleteUsersByPath,
  isLocal,
  sleep,
} from "./utils";
import {
  attachUserPolicy,
  createAccessKey,
  createPolicy,
  createRole,
  createUser,
} from "../../../iam/actions";

jest.setTimeout((isLocal ? 5 : 60) * 1000);

beforeEach(async () => {
  await deleteUsersByPath(path);
  await deletePoliciesByPath(path);
  await deleteRolesByPath(path);
});

afterAll(async () => {
  await deleteUsersByPath(path);
  await deletePoliciesByPath(path);
  await deleteRolesByPath(path);
});

test("User has permissions to assume a role", async () => {
  // Create a new user.
  const { User: user } = await createUser({ UserName: userName, Path: path });

  // Create access keys for the new user.
  const { AccessKey: accessKey } = await createAccessKey({
    UserName: userName,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const accessKeyId = accessKey!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const secretAccessKey = accessKey!.SecretAccessKey!;

  // Need to wait until the user and the access key are active.
  await sleep(isLocal ? 0 : 10);

  // Create a role with a trust policy that lets the user assume the role.
  const { Role: role } = await createRole({
    RoleName: roleName,
    Path: path,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: user?.Arn },
          Action: "sts:AssumeRole",
        },
      ],
    }),
  });

  // Create a policy that enables the user to assume the role.
  const { Policy: policy } = await createPolicy({
    PolicyName: policyName,
    Path: path,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "sts:AssumeRole",
          Resource: role?.Arn,
        },
      ],
    }),
  });

  // Attach the policy to the user.
  await attachUserPolicy({ PolicyArn: policy?.Arn, UserName: userName });

  // Need to wait until the policy has been attached to the user.
  await sleep(isLocal ? 0 : 10);

  const { Credentials: credentials } = await assumeRole(
    { RoleArn: role?.Arn, RoleSessionName: roleSessionName },
    { credentials: { accessKeyId, secretAccessKey } }
  );
  const {
    AccessKeyId: newAccessKeyId,
    SecretAccessKey: newSecretAccessKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = credentials!;

  expect(newAccessKeyId).toHaveLength(20);
  expect(newSecretAccessKey).toHaveLength(40);
});
