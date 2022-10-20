// sts/__tests__/wrapper.spec.ts
import { STSWrapper } from "../wrapper";
import { policyName, roleName, roleSessionName, userName } from "./dummy";
import { isLocal, sleep } from "./utils";
import { IAMWrapper } from "../../iam";

jest.setTimeout((isLocal ? 5 : 60) * 1000);

const iam = new IAMWrapper();

beforeEach(async () => {
  await iam.deleteUsersByPrefix(userName);
  await iam.deleteRolesByPrefix(roleName);
  await iam.deletePoliciesByPrefix(policyName);
});

afterAll(async () => {
  await iam.deleteUsersByPrefix(userName);
  await iam.deleteRolesByPrefix(roleName);
  await iam.deletePoliciesByPrefix(policyName);
});

test("User has permissions to assume a role", async () => {
  // Create a new user.
  const { User } = await iam.createUser({ UserName: userName });

  // Create access keys for the new user.
  const { AccessKey } = await iam.createAccessKey({ UserName: userName });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const accessKeyId = AccessKey!.AccessKeyId!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const secretAccessKey = AccessKey!.SecretAccessKey!;

  // Need to wait until the user and the access key are active.
  await sleep(isLocal ? 0 : 10);

  // Create a role with a trust policy that lets the user assume the role.
  const { Role } = await iam.createRole({
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
  const { Policy } = await iam.createPolicy({
    PolicyName: policyName,
    PolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        { Effect: "Allow", Action: "sts:AssumeRole", Resource: Role?.Arn },
      ],
    }),
  });

  // Attach the policy to the user.
  await iam.attachUserPolicy({ PolicyArn: Policy?.Arn, UserName: userName });

  // Need to wait until the policy has been attached to the user.
  await sleep(isLocal ? 0 : 15);

  const userSts = new STSWrapper({
    credentials: { accessKeyId, secretAccessKey },
  });
  const { Credentials } = await userSts.assumeRole({
    RoleArn: Role?.Arn,
    RoleSessionName: roleSessionName,
  });
  const {
    AccessKeyId: newAccessKeyId,
    SecretAccessKey: newSecretAccessKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = Credentials!;

  expect(newAccessKeyId).toHaveLength(20);
  expect(newSecretAccessKey).toHaveLength(40);
});
