// sts/actions/__tests__/wrapper.spec.ts
import { STSWrapper } from "../wrapper";
import { path, policyName, roleName, roleSessionName, userName } from "./dummy";
import {
  deletePoliciesByPath,
  deleteRolesByPath,
  deleteUsersByPath,
  isLocal,
  sleep,
} from "./utils";
import { IAMWrapper } from "../../iam";

jest.setTimeout((isLocal ? 5 : 60) * 1000);

const iam = new IAMWrapper();
const sleepSec = isLocal ? 0 : 10;

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
  const { User: user } = await iam.createUser({
    UserName: userName,
    Path: path,
  });

  // Create access keys for the new user.
  const { AccessKey: accessKey } = await iam.createAccessKey({
    UserName: userName,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const accessKeyId = accessKey!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const secretAccessKey = accessKey!.SecretAccessKey!;

  // Need to wait until the user and the access key are active.
  await sleep(sleepSec);

  // Create a role with a trust policy that lets the user assume the role.
  const { Role: role } = await iam.createRole({
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
  const { Policy: policy } = await iam.createPolicy({
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
  await iam.attachUserPolicy({ PolicyArn: policy?.Arn, UserName: userName });

  // Need to wait until the policy has been attached to the user.
  await sleep(sleepSec * 1.5);

  const userSts = new STSWrapper({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const { Credentials: credentials } = await userSts.assumeRole({
    RoleArn: role?.Arn,
    RoleSessionName: roleSessionName,
  });
  const {
    AccessKeyId: newAccessKeyId,
    SecretAccessKey: newSecretAccessKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = credentials!;

  expect(newAccessKeyId).toHaveLength(20);
  expect(newSecretAccessKey).toHaveLength(40);
});
