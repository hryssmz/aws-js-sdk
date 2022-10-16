// iam/scenarios/createUserAssumeRole.ts
import {
  attachRolePolicy,
  attachUserPolicy,
  createAccessKey,
  createPolicy,
  createRole,
  createUser,
  deleteAccessKey,
  deletePolicy,
  deleteRole,
  deleteUser,
  detachRolePolicy,
  detachUserPolicy,
} from "../actions";
import { listBuckets } from "../../s3/actions";
import { assumeRole } from "../../sts/actions";
import { isLocal, sleep } from "../../utils";

export interface CreateUserAssumeRoleInput {
  assumePolicyName: string;
  path: string;
  roleName: string;
  roleSessionName: string;
  s3PolicyName: string;
  userName: string;
}

export const createUserAssumeRole = async ({
  assumePolicyName,
  path,
  roleName,
  roleSessionName,
  s3PolicyName,
  userName,
}: CreateUserAssumeRoleInput) => {
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

  // Create a new policy to allow the role to list all buckets.
  const { Policy: s3Policy } = await createPolicy({
    PolicyName: s3PolicyName,
    Path: path,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:ListAllMyBuckets", "sts:AssumeRole"],
          Resource: "*",
        },
      ],
    }),
  });

  // Attach to the role the policy with permissions to list all buckets.
  await attachRolePolicy({ PolicyArn: s3Policy?.Arn, RoleName: roleName });

  // Create a policy that enables the user to assume the role.
  const { Policy: assumePolicy } = await createPolicy({
    PolicyName: assumePolicyName,
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
  await attachUserPolicy({ PolicyArn: assumePolicy?.Arn, UserName: userName });

  // Need to wait until the policy has been attached to the user.
  await sleep(isLocal ? 0 : 10);

  // Assume for the user the role with permission to list all buckets
  const { Credentials: credentials } = await assumeRole(
    {
      RoleArn: role?.Arn,
      RoleSessionName: roleSessionName,
      DurationSeconds: 900,
    },
    { credentials: { accessKeyId, secretAccessKey } }
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newAccessKeyId = credentials!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newSecretAccessKey = credentials!.SecretAccessKey!;
  const sessionToken = credentials?.SessionToken;

  // Need to wait until for the user to assume the role
  await sleep(isLocal ? 0 : 10);

  // List all S3 buckets.
  const { Buckets: buckets } = await listBuckets(
    {},
    {
      credentials: {
        accessKeyId: newAccessKeyId,
        secretAccessKey: newSecretAccessKey,
        sessionToken,
      },
    }
  );

  // Detach assume role policy from the user.
  await detachUserPolicy({ PolicyArn: assumePolicy?.Arn, UserName: userName });

  // Detach s3 policy from the role.
  await detachRolePolicy({ PolicyArn: s3Policy?.Arn, RoleName: roleName });

  // Delete assume role policy.
  await deletePolicy({ PolicyArn: assumePolicy?.Arn });

  // Delete s3 policy.
  await deletePolicy({ PolicyArn: s3Policy?.Arn });

  // Delete access keys.
  await deleteAccessKey({ UserName: userName, AccessKeyId: accessKeyId });

  // Delete user.
  await deleteUser({ UserName: userName });

  // Delete role.
  await deleteRole({ RoleName: roleName });

  return buckets;
};
